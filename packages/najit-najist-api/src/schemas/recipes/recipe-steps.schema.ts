import { z } from 'zod';

export const recipeStepSchema = z.object({
  content: z.string(),
  duration: z.number(),
});

export type RecipeStep = z.infer<typeof recipeStepSchema>;
