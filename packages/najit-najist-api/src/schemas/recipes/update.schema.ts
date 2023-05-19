import { z } from 'zod';
import { recipeSchema } from './recipe.schema';

export const updateRecipeInputSchema = recipeSchema
  .partial()
  .omit({
    type: true,
    difficulty: true,
    created: true,
    id: true,
    slug: true,
    updated: true,
  });

export type UpdateRecipeInput = z.infer<typeof updateRecipeInputSchema>;
