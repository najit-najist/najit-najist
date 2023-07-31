import { ListResult } from '@najit-najist/pb';
import {
  createRecipeDifficultyInputSchema,
  createRecipeInputSchema,
  createRecipeResourceMetricInputSchema,
  createRecipeTypeInputSchema,
  getManyRecipesInputSchema,
  getOneRecipeInputSchema,
  Recipe,
  updateRecipeInputSchema,
} from '@schemas';
import { t } from '@trpc';
import { RecipesService } from '@services';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const metricsRouter = t.router({
  getMany: protectedProcedure.query(() =>
    RecipesService.resourceMetrics.getMany({
      page: 1,
      perPage: 999,
    })
  ),

  create: onlyAdminProcedure
    .input(createRecipeResourceMetricInputSchema)
    .mutation(({ input }) => RecipesService.resourceMetrics.create(input)),
});

const difficultiesRouter = t.router({
  getMany: protectedProcedure.query(() =>
    RecipesService.difficulties.getMany({
      page: 1,
      perPage: 999,
    })
  ),

  create: onlyAdminProcedure
    .input(createRecipeDifficultyInputSchema)
    .mutation(({ input }) => RecipesService.difficulties.create(input)),
});

const typesRouter = t.router({
  getMany: protectedProcedure.query(() =>
    RecipesService.types.getMany({
      page: 1,
      perPage: 999,
    })
  ),

  create: onlyAdminProcedure
    .input(createRecipeTypeInputSchema)
    .mutation(({ input }) => RecipesService.types.create(input)),
});

export const recipesRouter = t.router({
  create: onlyAdminProcedure
    .input(createRecipeInputSchema)
    .mutation<Recipe>(async ({ ctx, input }) => {
      const result = await RecipesService.create(input);

      revalidatePath(`/recepty/${result.slug}`);
      revalidatePath(`/recepty`);

      return result;
    }),

  update: onlyAdminProcedure
    .input(z.object({ id: z.string(), data: updateRecipeInputSchema }))
    .mutation<Recipe>(async ({ ctx, input }) => {
      const result = await RecipesService.update(input.id, input.data);

      revalidatePath(`/recepty/${result.slug}`);
      revalidatePath(`/recepty`);

      return result;
    }),

  getMany: protectedProcedure
    .input(getManyRecipesInputSchema)
    .query<ListResult<Recipe>>(async ({ ctx, input }) =>
      RecipesService.getMany(input)
    ),

  getOne: protectedProcedure
    .input(getOneRecipeInputSchema)
    .query<Recipe>(async ({ ctx, input }) =>
      RecipesService.getBy('id', input.where.id)
    ),

  metrics: metricsRouter,
  difficulties: difficultiesRouter,
  types: typesRouter,
});
