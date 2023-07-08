import { z } from 'zod';

export const createUserLikedRecipesInputSchema = z.object({
  likedBy: z.string(),
  likedItem: z.string(),
});

export type CreateUserLikedRecipesInput = z.input<
  typeof createUserLikedRecipesInputSchema
>;
