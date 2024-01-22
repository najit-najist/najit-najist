import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';
import { slugifyString } from '@utils';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import {
  RecipeDifficulty,
  createRecipeDifficultyInputSchema,
  getManyRecipeDifficultiesSchema,
} from '../../../schemas/recipes';
import { createRequestPocketbaseRequestOptions } from '../../../server';
import { t } from '../../../trpc';
import {
  ErrorCodes,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '../../../types';

export const difficultiesRouter = t.router({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await pocketbase
          .collection(PocketbaseCollections.RECIPE_DIFFICULTY)
          .getFirstListItem<RecipeDifficulty>(
            `id="${input.id}"`,
            createRequestPocketbaseRequestOptions(ctx)
          );
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 400) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Náročnost receptu pod daným polem 'id' nebyl nalezen`,
            origin: 'RecipeDifficultyService',
          });
        }

        throw error;
      }
    }),

  getMany: protectedProcedure
    .input(getManyRecipeDifficultiesSchema.optional())
    .query(({ input, ctx }) => {
      const { page = 1, perPage = 40 } = input ?? {};

      return pocketbase
        .collection(PocketbaseCollections.RECIPE_DIFFICULTY)
        .getList<RecipeDifficulty>(
          page,
          perPage,
          createRequestPocketbaseRequestOptions(ctx)
        );
    }),

  create: onlyAdminProcedure
    .input(createRecipeDifficultyInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { color, name } = input;
      try {
        return await pocketbase
          .collection(PocketbaseCollections.RECIPE_DIFFICULTY)
          .create(
            { name, color, slug: slugifyString(name) },
            createRequestPocketbaseRequestOptions(ctx)
          );
      } catch (error) {
        if (error instanceof ClientResponseError) {
          const data = error.data.data;

          if (
            data.name?.code === PocketbaseErrorCodes.NOT_UNIQUE ||
            data.slug?.code === PocketbaseErrorCodes.NOT_UNIQUE
          ) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název složitosti musí být unikátní`,
              origin: 'RecipeDifficultyService',
            });
          } else if (data.color?.code === PocketbaseErrorCodes.NOT_UNIQUE) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Barva složitosti musí být unikátní`,
              origin: 'RecipeDifficultyService',
            });
          }
        }

        throw error;
      }
    }),
});
