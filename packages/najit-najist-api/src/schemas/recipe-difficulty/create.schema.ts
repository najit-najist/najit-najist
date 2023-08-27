import { recipeDifficultySchema } from 'schemas/recipes';
import { z } from 'zod';

export const createRecipeDifficultyInputSchema = recipeDifficultySchema.omit({
  id: true,
  created: true,
  slug: true,
  updated: true,
});

export type CreateRecipeDifficultyInput = z.infer<
  typeof createRecipeDifficultyInputSchema
>;
