import { entrySchema } from '../entry.schema';
import { defaultGetManySchema } from '../base.get-many.schema';
import { z } from 'zod';

export const recipeDifficultySchema = entrySchema.extend({
  name: z.string().trim().min(1, 'Název je povinný'),
  color: z.string(),
  slug: z.string().trim(),
});

export const getManyRecipeDifficultiesSchema = defaultGetManySchema
  .omit({ perPage: true })
  .extend({
    perPage: z.number().min(1).default(99).optional(),
  });

export const createRecipeDifficultyInputSchema = recipeDifficultySchema.omit({
  id: true,
  created: true,
  slug: true,
  updated: true,
});

export type CreateRecipeDifficultyInput = z.infer<
  typeof createRecipeDifficultyInputSchema
>;
export type GetManyRecipeDifficulties = z.infer<
  typeof getManyRecipeDifficultiesSchema
>;
export type RecipeDifficulty = z.infer<typeof recipeDifficultySchema>;
