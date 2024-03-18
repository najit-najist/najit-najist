import { z } from 'zod';

export const recipeStepItemCreateInputSchema = z.object({
  content: z.string(),
  duration: z.number(),
});
