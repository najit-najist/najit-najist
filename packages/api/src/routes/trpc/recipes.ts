import { ErrorCodes } from '@custom-types';
import { database } from '@najit-najist/database';
import {
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
  RecipeResource,
  RecipeResourceMetric,
  RecipeStep,
  recipeCategories,
  recipeDifficulties,
  recipeImages,
  recipeResources,
  recipeSteps,
  recipes,
} from '@najit-najist/database/models';
import { isFileBase64, slugSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { slugifyString } from '@utils';
import generateCursor from 'drizzle-cursor';
import {
  SQL,
  and,
  eq,
  getTableName,
  ilike,
  inArray,
  or,
  sql,
} from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { LibraryService } from '../../LibraryService';
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
  create: onlyAdminProcedure
    .input(recipeCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const library = new LibraryService(recipes);

      try {
        const recipe = await database.transaction(async (tx) => {
          library.beginTransaction();

          const { images, steps, resources, ...createPayload } = input;
          const [created] = await tx
            .insert(recipes)
            .values({
              ...createPayload,
              categoryId: input.category.id,
              difficultyId: input.difficulty.id,
              slug: slugifyString(input.title),
              createdById: ctx.sessionData.userId,
            })
            .returning();

          await Promise.all([
            ...images.map((encoded) =>
              library
                .create(created, encoded)
                .then(({ filename }) =>
                  tx
                    .insert(recipeImages)
                    .values({ file: filename, recipeId: created.id })
                )
            ),
            tx.insert(recipeSteps).values(
              steps.map((step) => ({
                recipeId: recipe.id,
                title: step.title,
                parts: step.parts,
              }))
            ),
            tx.insert(recipeResources).values(
              resources.map((resource) => ({
                recipeId: recipe.id,
                count: resource.count,
                metricId: resource.metric.id,
                title: resource.title,
                description: resource.description,
                optional: resource.optional,
              }))
            ),
          ]);

          await library.commit();

          return created;
        });

        // TODO: handle images

        revalidatePath(`/recepty/${recipe.slug}`);
        revalidatePath(`/recepty`);

        return recipe;
      } catch (error) {
        library.endTransaction();
        logger.error(error, 'Could not create recipe');

        throw error;
      }
    }),

  update: onlyAdminProcedure
    .input(entityLinkSchema.extend({ data: recipeUpdateInputSchema }))
    .mutation(async ({ ctx, input }) => {
      const library = new LibraryService(recipes);
      library.beginTransaction();

      try {
        const existing = await getOneBy('id', input.id);
        const {
          images,
          category,
          difficulty,
          resources,
          steps,
          ...updatePayload
        } = input.data;

        await database.transaction(async (tx) => {
          await tx
            .update(recipes)
            .set({
              ...updatePayload,
              updateById: ctx.sessionData.userId,
              updatedAt: new Date(),
              ...(category?.id ? { categoryId: category.id } : {}),
              ...(difficulty?.id ? { difficultyId: difficulty.id } : {}),
            })
            .where(eq(recipes.id, existing.id));

          if (steps) {
            const stepsThatRemain = steps.filter(({ id }) => !!id);
            const stepsThatRemainAsIds = stepsThatRemain.map(({ id }) => id);
            const promisesToFulfill: Promise<any>[] = [];

            const stepsToDelete = existing.resources.filter(
              ({ id }) => !stepsThatRemainAsIds.includes(id)
            );
            if (stepsToDelete.length) {
              promisesToFulfill.push(
                tx.delete(recipeSteps).where(
                  and(
                    eq(recipeSteps.recipeId, existing.id),
                    inArray(
                      recipeSteps.id,
                      stepsToDelete.map(({ id }) => id)
                    )
                  )
                )
              );
            }

            if (stepsThatRemain.length) {
              for (const step of stepsThatRemain) {
                promisesToFulfill.push(
                  tx
                    .update(recipeSteps)
                    .set({
                      parts: step.parts,
                      updatedAt: new Date(),
                      title: step.title,
                    })
                    .where(
                      and(
                        eq(recipeSteps.id, step.id!),
                        eq(recipeSteps.recipeId, existing.id)
                      )
                    )
                );
              }
            }

            const stepsToCreate = steps.filter(({ id }) => !id);
            if (stepsToCreate.length) {
              promisesToFulfill.push(
                tx.insert(recipeSteps).values(
                  stepsToCreate.map((step) => ({
                    ...step,
                    recipeId: existing.id,
                  }))
                )
              );
            }

            await Promise.all(promisesToFulfill);
          }

          if (resources) {
            const resourcesThatRemain = resources.filter(({ id }) => !!id);
            const resourcesThatRemainAsIds = resourcesThatRemain.map(
              ({ id }) => id
            );
            const promisesToFulfill: Promise<any>[] = [];

            const resourcesToDelete = existing.resources.filter(
              ({ id }) => !resourcesThatRemainAsIds.includes(id)
            );
            if (resourcesToDelete.length) {
              promisesToFulfill.push(
                tx.delete(recipeResources).where(
                  and(
                    eq(recipeSteps.recipeId, existing.id),
                    inArray(
                      recipeResources.id,
                      resourcesToDelete.map(({ id }) => id)
                    )
                  )
                )
              );
            }

            if (resourcesThatRemain.length) {
              for (const resource of resourcesThatRemain) {
                promisesToFulfill.push(
                  tx
                    .update(recipeResources)
                    .set({
                      count: resource.count,
                      description: resource.description,
                      updatedAt: new Date(),
                      metricId: resource.metric.id,
                      title: resource.title,
                      optional: resource.optional,
                    })
                    .where(
                      and(
                        eq(recipeResources.id, resource.id!),
                        eq(recipeResources.recipeId, existing.id)
                      )
                    )
                );
              }
            }

            const resourcesToCreate = resources.filter(({ id }) => !id);
            if (resourcesToCreate.length) {
              promisesToFulfill.push(
                tx.insert(recipeResources).values(
                  resourcesToCreate.map((resource) => ({
                    ...resource,
                    metricId: resource.metric.id,
                    recipeId: existing.id,
                  }))
                )
              );
            }

            await Promise.all(promisesToFulfill);
          }

          if (images) {
            const filesToDelete = existing.images.filter(
              ({ file }) => !images.includes(file)
            );

            const promisesToFullfill: Promise<any>[] = [];

            if (filesToDelete.length) {
              promisesToFullfill.push(
                tx.delete(recipeImages).where(
                  inArray(
                    recipeImages.id,
                    filesToDelete.map(({ id }) => id)
                  )
                ),
                ...filesToDelete.map(({ file }) =>
                  library.delete(existing, file)
                )
              );
            }

            promisesToFullfill.push(
              ...images
                .filter((newOrExistingImage) =>
                  isFileBase64(newOrExistingImage)
                )
                .map((newImage) =>
                  library
                    .create(existing, newImage)
                    .then(({ filename }) =>
                      tx
                        .insert(recipeImages)
                        .values({ file: filename, recipeId: existing.id })
                    )
                )
            );

            await Promise.all(promisesToFullfill);
          }
        });

        revalidatePath(`/recepty/${existing.slug}`);
        revalidatePath(`/recepty`);

        return existing;
      } catch (error) {
        library.endTransaction();

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
        .default({})
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
              })
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
              })
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
              ilike(recipes.slug, `%${search}%`)
            )!
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
      }
    ),

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

        return await getOneBy(filter[0] as keyof Recipe, filter[1]);
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
