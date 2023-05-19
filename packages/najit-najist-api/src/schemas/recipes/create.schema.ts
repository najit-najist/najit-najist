import { z } from 'zod';
import { recipeSchema } from './recipe.schema';

export const createRecipeInputSchema = recipeSchema.omit({
  type: true,
  difficulty: true,
  created: true,
  id: true,
  slug: true,
  updated: true,
});

export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>;
