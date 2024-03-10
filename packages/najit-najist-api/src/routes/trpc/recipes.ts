import { ErrorCodes } from '@custom-types';
import { database } from '@najit-najist/database';
import {
  Recipe,
  recipeCategories,
  recipeDifficulties,
  recipeImages,
  recipeResourceMetrics,
  recipeResources,
  recipeSteps,
  recipes,
} from '@najit-najist/database/models';
import { slugSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { slugifyString } from '@utils';
import { SQL, and, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { ApplicationError } from '../../errors/ApplicationError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { recipeCreateInputSchema } from '../../schemas/recipeCreateInputSchema';
import { recipeUpdateInputSchema } from '../../schemas/recipeUpdateInputSchema';
import { logger } from '../../server';
import { difficultiesRouter } from './recipes/difficulties';
import { metricsRouter } from './recipes/metrics';
import { typesRouter } from './recipes/types';

const includeWith = {
  category: true,
  difficulty: true,
  images: true,
  resources: {
    with: {
      metric: true,
    },
  },
} as const;

const getOneBy = async <V extends keyof Recipe>(by: V, value: Recipe[V]) => {
  const item = await database.query.recipes.findFirst({
    with: includeWith,
    where: (schema, { eq }) => eq(schema[by], value as any),
  });

  if (!item) {
    throw new EntityNotFoundError({ entityName: recipes._.name });
  }

  return item;
};

export const recipesRouter = t.router({
  create: onlyAdminProcedure
    .input(recipeCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Transactions!
        const [recipe] = await database
          .insert(recipes)
          .values({
            ...input,
            categoryId: input.type.id,
            difficultyId: input.difficulty.id,
            slug: slugifyString(input.title),
            createdBy: ctx.sessionData.userId,
          })
          .returning();

        await database.insert(recipeSteps).values(
          input.steps.map((step) => ({
            recipeId: recipe.id,
            title: step.title,
            parts: step.parts,
          }))
        );

        await database.insert(recipeResources).values(
          input.resources.map((resource) => ({
            recipeId: recipe.id,
            count: resource.count,
            metricId: resource.metric.id,
            title: resource.title,
            description: resource.description,
            optional: resource.isOptional,
          }))
        );

        // TODO: handle images

        revalidatePath(`/recepty/${recipe.slug}`);
        revalidatePath(`/recepty`);
      } catch (error) {
        logger.error(error, 'Could not create recipe');

        throw error;
      }
    }),

  update: onlyAdminProcedure
    .input(entityLinkSchema.extend({ data: recipeUpdateInputSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await getOneBy('id', input.id);

        // TODO: Update

        revalidatePath(`/recepty/${existing.slug}`);
        revalidatePath(`/recepty`);
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Recept pod daným id '${input.id}' nebyl nalezen`,
            origin: 'recipes',
          });
        }

        throw error;
      }
    }),

  delete: onlyAdminProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      const existing = await getOneBy('id', input.id);

      await database.delete(recipes).where(eq(recipes.id, existing.id));

      revalidatePath(`/recepty/${existing.slug}`);
      revalidatePath(`/recepty`);

      return;
    }),

  getMany: protectedProcedure
    .input(
      defaultGetManySchema
        .extend({
          typeSlug: slugSchema.optional(),
          difficultySlug: slugSchema.optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const {
        page = 1,
        perPage = 40,
        difficultySlug,
        search,
        typeSlug,
      } = input ?? {};

      const conditions: SQL[] = [];

      if (difficultySlug) {
        conditions.push(eq(recipeDifficulties.slug, difficultySlug));
      }

      if (typeSlug) {
        conditions.push(eq(recipeCategories.slug, typeSlug));
      }

      if (search) {
        conditions.push(
          or(ilike(recipes.title, search), ilike(recipes.slug, search))!
        );
      }

      const items = await database
        .select()
        .from(recipes)
        .leftJoin(
          recipeDifficulties,
          eq(recipes.difficultyId, recipeDifficulties.id)
        )
        .leftJoin(recipeCategories, eq(recipes.categoryId, recipeCategories.id))
        .leftJoin(recipeSteps, eq(recipes.id, recipeSteps.recipeId))
        .leftJoin(recipeImages, eq(recipes.id, recipeImages.recipeId))
        .leftJoin(recipeResources, eq(recipes.id, recipeResources.recipeId))
        .leftJoin(
          recipeResourceMetrics,
          eq(recipeResourceMetrics.id, recipeResources.metricId)
        )
        .where(conditions.length ? and(...conditions) : undefined);

      // TODO: Paginations

      return items;
    }),

  getOne: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .or(z.object({ slug: z.string() }))
    )
    .query(async ({ input }) => {
      try {
        const [filter] = Object.entries(input);

        return getOneBy(filter[0] as keyof Recipe, filter[1]);
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Recept pod daným polem '${Object.keys(
              input
            )}' nebyl nalezen`,
            origin: 'RecipesService',
          });
        }

        throw error;
      }
    }),

  metrics: metricsRouter,
  difficulties: difficultiesRouter,
  types: typesRouter,
});
