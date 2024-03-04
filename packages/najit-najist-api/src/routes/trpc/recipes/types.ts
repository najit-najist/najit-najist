import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';
import { slugifyString } from '@utils';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { defaultGetManySchema } from '../../../schemas/base.get-many.schema';
import {
  RecipeType,
  createRecipeTypeInputSchema,
} from '../../../schemas/recipes';
import { createRequestPocketbaseRequestOptions } from '../../../server';
import { t } from '../../../trpc';
import {
  ErrorCodes,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '../../../types';

export const typesRouter = t.router({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await pocketbase
          .collection(PocketbaseCollections.RECIPE_TYPES)
          .getFirstListItem<RecipeType>(
            `id="${input.id}"`,
            createRequestPocketbaseRequestOptions(ctx)
          );
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 400) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Náročnost receptu pod daným polem 'id' nebyl nalezen`,
            origin: 'RecipeTypeService',
          });
        }

        throw error;
      }
    }),

  getMany: protectedProcedure
    .input(
      defaultGetManySchema
        .omit({ perPage: true })
        .extend({
          perPage: z.number().min(1).default(99).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const { page = 1, perPage = 40 } = input ?? {};

      return await pocketbase
        .collection(PocketbaseCollections.RECIPE_TYPES)
        .getList<RecipeType>(
          page,
          perPage,
          createRequestPocketbaseRequestOptions(ctx)
        );
    }),

  create: onlyAdminProcedure
    .input(createRecipeTypeInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await pocketbase
          .collection(PocketbaseCollections.RECIPE_TYPES)
          .create(
            { title: input.title, slug: slugifyString(input.title) },
            createRequestPocketbaseRequestOptions(ctx)
          );
      } catch (error) {
        if (error instanceof ClientResponseError) {
          const data = error.data.data;

          if (
            data.title?.code === PocketbaseErrorCodes.NOT_UNIQUE ||
            data.slug?.code === PocketbaseErrorCodes.NOT_UNIQUE
          ) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název typu musí být unikátní`,
              origin: 'RecipeTypeService',
            });
          }
        }

        throw error;
      }
    }),
});
