import { ErrorCodes } from '@custom-types';
import { database } from '@najit-najist/database';
import {
  SQL,
  and,
  eq,
  getTableName,
  ilike,
  or,
  sql,
} from '@najit-najist/database/drizzle';
import {
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
  RecipeResource,
  RecipeResourceMetric,
  RecipeStep,
  recipeImages,
  recipes,
} from '@najit-najist/database/models';
import { slugSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import generateCursor from 'drizzle-cursor';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { ApplicationError } from '../../errors/ApplicationError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { t } from '../instance';
import { onlyAdminProcedure } from '../procedures/onlyAdminProcedure';
import { protectedProcedure } from '../procedures/protectedProcedure';
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
  steps: true,
} as const;

const getOneBy = async <V extends keyof Recipe>(by: V, value: Recipe[V]) => {
  const item = await database.query.recipes.findFirst({
    with: includeWith,
    where: (schema, { eq }) => eq(schema[by], value as any),
  });

  if (!item) {
    throw new EntityNotFoundError({ entityName: getTableName(recipes) });
  }

  return item;
};

export const recipesRouter = t.router({
  getMany: protectedProcedure
    .input(
      defaultGetManySchema
        .extend({
          typeSlug: slugSchema.optional(),
          difficultySlug: slugSchema.optional(),
        })
        .default({}),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{
        items: Array<
          Recipe & {
            difficulty: RecipeDifficulty;
            category: RecipeCategory;
            images: (typeof recipeImages.$inferSelect)[];
            resources: Array<RecipeResource & { metric: RecipeResourceMetric }>;
            steps: RecipeStep[];
          }
        >;
        total: number;
        nextToken: string | null;
      }> => {
        const { difficultySlug, search, typeSlug: categorySlug } = input ?? {};
        const conditions: SQL[] = [];
        const conditionsPromises: Promise<any>[] = [];

        if (difficultySlug) {
          conditionsPromises.push(
            database.query.recipeDifficulties
              .findFirst({
                where: (s, { eq }) => eq(s.slug, difficultySlug),
              })
              .then((difficulty) => {
                if (!difficulty) {
                  return null;
                }

                return conditions.push(eq(recipes.difficultyId, difficulty.id));
              }),
          );
        }

        if (categorySlug) {
          conditionsPromises.push(
            database.query.recipeCategories
              .findFirst({
                where: (s, { eq }) => eq(s.slug, categorySlug),
              })
              .then((category) => {
                if (!category) {
                  return null;
                }

                return conditions.push(eq(recipes.categoryId, category.id));
              }),
          );
        }

        await Promise.all(conditionsPromises);

        if (conditions.find((value) => !value)) {
          return { items: [], total: 0, nextToken: null };
        }

        if (search) {
          conditions.push(
            or(
              ilike(recipes.title, `%${search}%`),
              ilike(recipes.slug, `%${search}%`),
            )!,
          );
        }

        const cursor = generateCursor({
          primaryCursor: {
            order: 'ASC',
            key: recipes.id.name,
            schema: recipes.id,
          },
          cursors: [
            {
              order: 'DESC',
              key: recipes.createdAt.name,
              schema: recipes.createdAt,
            },
          ],
        });

        const [items, [{ count }]] = await Promise.all([
          database.query.recipes.findMany({
            with: includeWith,
            orderBy: cursor.orderBy,
            limit: input.perPage,
            where: and(...conditions, cursor.where(input.page)),
          }),
          database
            .select({
              count: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(recipes)
            .where(and(...conditions)),
        ]);

        return {
          items,
          nextToken:
            input.perPage === items.length
              ? cursor.serialize(items.at(-1))
              : null,
          total: count,
        };
      },
    ),

  getOne: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .or(z.object({ slug: z.string() })),
    )
    .query(async ({ input }) => {
      try {
        const [filter] = Object.entries(input);

        return await getOneBy(filter[0] as keyof Recipe, filter[1]);
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Recept pod daným polem '${Object.keys(
              input,
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
