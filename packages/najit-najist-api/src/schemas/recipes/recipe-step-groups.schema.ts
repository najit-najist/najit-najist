import { z } from 'zod';
import { recipeStepSchema } from './recipe-steps.schema';

export const recipeStepGroupSchema = z.object({
  title: z.string().trim().describe('Group title'),
  parts: z.array(recipeStepSchema).min(1),
});

export type RecipeStepGroup = z.infer<typeof recipeStepGroupSchema>;
