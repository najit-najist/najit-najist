import { ListResult } from '@najit-najist/pb';
import {
  createRecipeInputSchema,
  dislikeRecipeInputSchema,
  getManyRecipesInputSchema,
  getOneRecipeInputSchema,
  likeRecipeInputSchema,
  Recipe,
  updateRecipeInputSchema,
} from '@schemas';
import { t } from '@trpc';
import { RecipesService, UserLikedRecipesService } from '@services';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const recipesRouter = t.router({
  create: protectedProcedure
    .input(createRecipeInputSchema)
    .mutation<Recipe>(async ({ ctx, input }) => {
      const result = await RecipesService.create(input);

      revalidatePath(`/recepty/${result.slug}`);
      revalidatePath(`/recepty`);

      return result;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateRecipeInputSchema }))
    .mutation<Recipe>(async ({ ctx, input }) => {
      const result = await RecipesService.update(input.id, input.data);

      revalidatePath(`/recepty/${result.slug}`);
      revalidatePath(`/recepty`);

      return result;
    }),

  getMany: t.procedure
    .input(getManyRecipesInputSchema)
    .query<ListResult<Recipe>>(async ({ ctx, input }) =>
      RecipesService.getMany(input)
    ),

  getOne: t.procedure
    .input(getOneRecipeInputSchema)
    .query<Recipe>(async ({ ctx, input }) =>
      RecipesService.getBy('id', input.where.id)
    ),

  likeOne: protectedProcedure
    .input(likeRecipeInputSchema)
    .mutation(async ({ input, ctx }) =>
      UserLikedRecipesService.create({
        likedBy: ctx.sessionData.userId,
        likedItem: input.id,
      })
    ),

  dislikeOne: protectedProcedure
    .input(dislikeRecipeInputSchema)
    .mutation(async ({ input, ctx }) => {
      const recipe = await UserLikedRecipesService.getOne({
        likedItem: input.itemId,
      });

      await UserLikedRecipesService.delete(recipe.id);
    }),
});
