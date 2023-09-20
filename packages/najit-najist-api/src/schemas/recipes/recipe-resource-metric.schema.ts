import { entrySchema } from '../entry.schema';
import { z } from 'zod';

export const recipeResourceMetricSchema = entrySchema.extend({
  name: z.string().trim().min(1, 'Název je povinný'),
});

export const getManyRecipeResourceMetricInputSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  perPage: z.number().min(1).default(20).optional(),
});

export const createRecipeResourceMetricInputSchema =
  recipeResourceMetricSchema.omit({
    id: true,
    created: true,
    updated: true,
  });

export type GetManyRecipeResourceMetricInput = z.infer<
  typeof getManyRecipeResourceMetricInputSchema
>;
export type RecipeResourceMetric = z.infer<typeof recipeResourceMetricSchema>;
export type CreateRecipeResourceMetricInput = z.infer<
  typeof createRecipeResourceMetricInputSchema
>;
