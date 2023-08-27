import { z } from 'zod';
import { recipeTypeSchema } from '../recipes';

export const createRecipeTypeInputSchema = recipeTypeSchema.omit({
  created: true,
  id: true,
  slug: true,
  updated: true,
});

export type CreateRecipeTypeInput = z.infer<typeof createRecipeTypeInputSchema>;
