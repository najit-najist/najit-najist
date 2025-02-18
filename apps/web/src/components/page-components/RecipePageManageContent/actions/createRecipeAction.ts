'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import {
  UserRoles,
  recipeImages,
  recipeResources,
  recipeSteps,
  recipes,
} from '@najit-najist/database/models';
import { recipeCreateInputSchema } from '@server/schemas/recipeCreateInputSchema';
import { LibraryService } from '@server/services/LibraryService';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { slugifyString } from '@server/utils/slugifyString';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createRecipeAction = createActionWithValidation(
  recipeCreateInputSchema,
  async (input) => {
    const loggedInUser = await getLoggedInUser();

    if (loggedInUser.role !== UserRoles.ADMIN) {
      logger.error('[RECIPES] NON ADMIN - tried to create recipe');
      throw new Error('Not authorized');
    }

    const library = new LibraryService(recipes);
    const loggedInUserId = loggedInUser.id;

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
            createdById: loggedInUserId,
          })
          .returning();

        const createdImages = await Promise.all(
          images.map((encoded) => library.create(created, encoded)),
        );

        await tx.insert(recipeImages).values(
          createdImages.map(({ filename }) => ({
            file: filename,
            recipeId: created.id,
          })),
        );

        await tx.insert(recipeSteps).values(
          steps.map((step) => ({
            recipeId: created.id,
            title: step.title,
            parts: step.parts,
          })),
        );

        await tx.insert(recipeResources).values(
          resources.map((resource) => ({
            recipeId: created.id,
            count: resource.count,
            metricId: resource.metric.id,
            title: resource.title,
            description: resource.description,
            optional: resource.optional,
          })),
        );

        await library.commit();

        return created;
      });

      const adminRoute = `/administrace/recepty/${recipe.slug}`;
      revalidatePath(`/recepty/${recipe.slug}`);
      revalidatePath(adminRoute);
      revalidatePath(`/recepty`);
      revalidatePath(`/administrace`);

      return redirect(adminRoute);
    } catch (error) {
      library.endTransaction();

      throw error;
    }
  },
  {
    onHandlerError(error, input) {
      logger.error('[RECIPES] Could not create recipe', { error, input });
    },
  },
);
