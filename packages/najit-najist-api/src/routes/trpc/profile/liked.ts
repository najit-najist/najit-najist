import { dislikeRecipeInputSchema, likeRecipeInputSchema } from '@schemas';
import { UserLikedRecipesService } from '@services';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { z } from 'zod';

export const userLikedRecipesRoutes = t.router({
  getMany: protectedProcedure.query(({ ctx }) => {
    UserLikedRecipesService.getManyByUser(ctx.sessionData.userId);
  }),

  has: protectedProcedure.input(z.string()).query(({ input, ctx }) =>
    UserLikedRecipesService.getOne({
      likedBy: ctx.sessionData.userId,
      likedItem: input,
    }).catch(() => false)
  ),

  add: protectedProcedure
    .input(likeRecipeInputSchema)
    .mutation(async ({ input, ctx }) =>
      UserLikedRecipesService.create({
        likedBy: ctx.sessionData.userId,
        likedItem: input.id,
      })
    ),

  remove: protectedProcedure
    .input(dislikeRecipeInputSchema)
    .mutation(async ({ input, ctx }) => {
      const recipe = await UserLikedRecipesService.getOne({
        likedItem: input.itemId,
        likedBy: ctx.sessionData.userId,
      });

      await UserLikedRecipesService.delete(recipe.id);
    }),
});

export const userLikedRoutes = t.router({
  recipes: userLikedRecipesRoutes,
});
