import { recipeResourceMetricSchema } from '../recipes';
import { z } from 'zod';

export const createRecipeResourceMetricInputSchema =
  recipeResourceMetricSchema.omit({
    id: true,
    created: true,
    updated: true,
  });

export type CreateRecipeResourceMetricInput = z.infer<
  typeof createRecipeResourceMetricInputSchema
>;
