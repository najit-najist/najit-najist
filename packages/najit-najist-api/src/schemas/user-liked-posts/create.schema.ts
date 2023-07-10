import { z } from 'zod';

export const createUserLikedPostsInputSchema = z.object({
  likedBy: z.string(),
  likedItem: z.string(),
});

export type CreateUserLikedPostsInput = z.input<
  typeof createUserLikedPostsInputSchema
>;
