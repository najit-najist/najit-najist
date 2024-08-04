'use server';

import { database } from '@najit-najist/database';
import { and, eq, inArray } from '@najit-najist/database/drizzle';
import {
  UserRoles,
  recipeImages,
  recipeResources,
  recipeSteps,
  recipes,
} from '@najit-najist/database/models';
import { entityLinkSchema, isFileBase64 } from '@najit-najist/schemas';
import { logger } from '@server/logger';
import { recipeUpdateInputSchema } from '@server/schemas/recipeUpdateInputSchema';
import { LibraryService } from '@server/services/LibraryService';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

export const updateRecipeAction = createActionWithValidation(
  entityLinkSchema.extend({ data: recipeUpdateInputSchema }),
  async (input) => {
    const loggedInUser = await getLoggedInUser();

    if (loggedInUser.role !== UserRoles.ADMIN) {
      logger.error('NON ADMIN - tried to update recipe');
      throw new Error('Not authorized');
    }

    const library = new LibraryService(recipes);
    const loggedInUserId = loggedInUser.id;

    library.beginTransaction();

    const existing = await database.query.recipes.findFirst({
      with: {
        category: true,
        difficulty: true,
        images: true,
        resources: {
          with: {
            metric: true,
          },
        },
        steps: true,
      },
      where: (s, { eq }) => eq(s.id, input.id),
    });

    if (!existing) {
      notFound();
    }

    try {
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
            updateById: loggedInUserId,
            updatedAt: new Date(),
            ...(category?.id ? { categoryId: category.id } : {}),
            ...(difficulty?.id ? { difficultyId: difficulty.id } : {}),
          })
          .where(eq(recipes.id, existing.id));

        if (steps) {
          await tx
            .delete(recipeSteps)
            .where(eq(recipeSteps.recipeId, existing.id));

          if (steps.length) {
            await tx.insert(recipeSteps).values(
              steps.map((step) => ({
                ...step,
                recipeId: existing.id,
              })),
            );
          }
        }

        if (resources) {
          await tx
            .delete(recipeResources)
            .where(eq(recipeResources.recipeId, existing.id));

          if (resources.length) {
            await tx.insert(recipeResources).values(
              resources.map((resource) => ({
                ...resource,
                metricId: resource.metric.id,
                recipeId: existing.id,
              })),
            );
          }
        }

        if (images) {
          const filesToDelete = existing.images.filter(
            ({ file }) => !images.includes(file),
          );

          const promisesToFullfill: Promise<any>[] = [];

          if (filesToDelete.length) {
            promisesToFullfill.push(
              tx.delete(recipeImages).where(
                inArray(
                  recipeImages.id,
                  filesToDelete.map(({ id }) => id),
                ),
              ),
              ...filesToDelete.map(({ file }) =>
                library.delete(existing, file),
              ),
            );
          }

          promisesToFullfill.push(
            ...images
              .filter((newOrExistingImage) => isFileBase64(newOrExistingImage))
              .map((newImage) =>
                library
                  .create(existing, newImage)
                  .then(({ filename }) =>
                    tx
                      .insert(recipeImages)
                      .values({ file: filename, recipeId: existing.id }),
                  ),
              ),
          );

          await Promise.all(promisesToFullfill);
          await library.commit();
        }
      });

      revalidatePath(`/recepty/${existing.slug}`);
      revalidatePath(`/administrace/recepty/${existing.slug}`);
      revalidatePath(`/recepty`);
      revalidatePath(`/administrace`);

      return null;
    } catch (error) {
      library.endTransaction();

      throw error;
    }
  },
);
