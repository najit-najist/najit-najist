import {
  ClientResponseError,
  RecordListOptions,
  pocketbase,
} from '@najit-najist/pb';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { entityLinkSchema } from '../../../schemas/entityLinkSchema';
import { createRequestPocketbaseRequestOptions } from '../../../server';
import {
  ErrorCodes,
  PocketbaseCollections,
  UserLikedRecipe,
} from '../../../types';

const getOne = async (
  likedItem: string,
  requestOptions?: RecordListOptions
) => {
  try {
    return await pocketbase
      .collection(PocketbaseCollections.USER_LIKED_RECIPES)
      .getFirstListItem<UserLikedRecipe>(
        `likedItem="${likedItem}"`,
        requestOptions
      );
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 400) {
      throw new ApplicationError({
        code: ErrorCodes.ENTITY_MISSING,
        message: `Tento repect není v oblíbených receptech`,
        origin: 'UserService',
      });
    }

    throw error;
  }
};

export const userLikedRecipesRoutes = t.router({
  getMany: protectedProcedure.query(({ ctx }) =>
    pocketbase
      .collection(PocketbaseCollections.USER_LIKED_RECIPES)
      .getFullList<UserLikedRecipe>({
        ...createRequestPocketbaseRequestOptions(ctx),
        filter: `likedBy="${ctx.sessionData.userId}"`,
      })
  ),

  has: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) =>
      getOne(input, createRequestPocketbaseRequestOptions(ctx)).catch(
        () => false
      )
    ),

  add: protectedProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) =>
      pocketbase
        .collection(PocketbaseCollections.USER_LIKED_RECIPES)
        .create<UserLikedRecipe>(
          {
            likedBy: ctx.sessionData.userId,
            likedItem: input.id,
          },
          createRequestPocketbaseRequestOptions(ctx)
        )
    ),

  remove: protectedProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      const requestOptions = createRequestPocketbaseRequestOptions(ctx);
      const recipe = await getOne(input.id, requestOptions);

      await pocketbase
        .collection(PocketbaseCollections.USER_LIKED_RECIPES)
        .delete(recipe.id, requestOptions);
    }),
});

export const userLikedRoutes = t.router({
  recipes: userLikedRecipesRoutes,
});
