import { z } from 'zod';
import { recipeSchema } from './recipe.schema';

export const createRecipeInputSchema = recipeSchema
  .omit({
    type: true,
    difficulty: true,
    created: true,
    id: true,
    slug: true,
    updated: true,
  })
  .extend({
    type: z
      .string({ required_error: 'Toto pole je povinné' })
      .min(1, 'Toto pole je povinné'),
    difficulty: z
      .string({ required_error: 'Toto pole je povinné' })
      .min(1, 'Toto pole je povinné'),
  });

export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>;
