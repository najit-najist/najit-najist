import { ListResult } from '@najit-najist/pb';
import {
  createRecipeInputSchema,
  getManyRecipesInputSchema,
  getOneRecipeInputSchema,
  Recipe,
  updateRecipeInputSchema,
} from '@schemas';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const recipesRouter = t.router({
  create: protectedProcedure
    .input(createRecipeInputSchema)
    .mutation<Recipe>(async ({ ctx, input }) =>
      ctx.services.recipes.create(input)
    ),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateRecipeInputSchema }))
    .mutation<Recipe>(async ({ ctx, input }) => {
      const result = await ctx.services.recipes.update(input.id, input.data);

      revalidatePath(`/recepty/${result.slug}`);

      return result;
    }),

  getMany: t.procedure
    .input(getManyRecipesInputSchema)
    .query<ListResult<Recipe>>(async ({ ctx, input }) =>
      ctx.services.recipes.getMany(input)
    ),

  getOne: t.procedure
    .input(getOneRecipeInputSchema)
    .query<Recipe>(async ({ ctx, input }) =>
      ctx.services.recipes.getBy('id', input.where.id)
    ),
});
