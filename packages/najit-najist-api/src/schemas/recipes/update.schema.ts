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

export const likeRecipeInputSchema = recipeSchema.pick({ id: true });
export const dislikeRecipeInputSchema = z.object({
  itemId: z.string(),
});

export type UpdateRecipeInput = z.infer<typeof updateRecipeInputSchema>;
export type LikedRecipeInput = z.infer<typeof likeRecipeInputSchema>;
export type DislikedRecipeInput = z.infer<typeof dislikeRecipeInputSchema>;
