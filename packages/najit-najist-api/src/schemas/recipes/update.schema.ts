import { z } from 'zod';
import { recipeSchema } from './recipe.schema';

export const updateRecipeInputSchema = recipeSchema
  .omit({
    type: true,
    difficulty: true,
    created: true,
    id: true,
    slug: true,
    updated: true,
  })
  .extend({
    type: z.string(),
    difficulty: z.string(),
  })
  .partial();

export type UpdateRecipeInput = z.infer<typeof updateRecipeInputSchema>;
