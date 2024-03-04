import { PocketbaseCollections } from '@custom-types';
import { ListResult, pocketbase } from '@najit-najist/pb';
import { slugSchema } from '@najit-najist/schemas';
import {
  createRecipeInputSchema,
  Recipe,
  recipeSchema,
  updateRecipeInputSchema,
} from '@schemas';
import { RecipesService } from '@services';
import { t } from '@trpc';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { createRequestPocketbaseRequestOptions } from '../../server';
import { difficultiesRouter } from './recipes/difficulties';
import { metricsRouter } from './recipes/metrics';
import { typesRouter } from './recipes/types';

export const recipesRouter = t.router({
  create: onlyAdminProcedure
    .input(createRecipeInputSchema)
    .mutation<Recipe>(async ({ ctx, input }) => {
      const result = await RecipesService.create(
        input,
        createRequestPocketbaseRequestOptions(ctx)
      );

      revalidatePath(`/recepty/${result.slug}`);
      revalidatePath(`/recepty`);

      return result;
    }),

  update: onlyAdminProcedure
    .input(z.object({ id: z.string(), data: updateRecipeInputSchema }))
    .mutation<Recipe>(async ({ ctx, input }) => {
      const result = await RecipesService.update(
        input.id,
        input.data,
        createRequestPocketbaseRequestOptions(ctx)
      );

      revalidatePath(`/recepty/${result.slug}`);
      revalidatePath(`/recepty`);

      return result;
    }),

  delete: onlyAdminProcedure
    .input(recipeSchema.pick({ id: true, slug: true }))
    .mutation(async ({ input, ctx }) => {
      await pocketbase
        .collection(PocketbaseCollections.RECIPES)
        .delete(input.id, createRequestPocketbaseRequestOptions(ctx));

      revalidatePath(`/recepty/${input.slug}`);
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
        .optional()
    )
    .query<ListResult<Recipe>>(async ({ ctx, input }) =>
      RecipesService.getMany(input, createRequestPocketbaseRequestOptions(ctx))
    ),

  getOne: protectedProcedure
    .input(
      z.object({
        where: z
          .object({
            id: z.string(),
          })
          .or(z.object({ slug: z.string() })),
      })
    )
    .query<Recipe>(async ({ ctx, input }) =>
      RecipesService.getBy(
        'slug' in input.where ? 'slug' : 'id',
        'slug' in input.where ? input.where.slug : input.where.id,
        createRequestPocketbaseRequestOptions(ctx)
      )
    ),

  metrics: metricsRouter,
  difficulties: difficultiesRouter,
  types: typesRouter,
});
