import { z } from 'zod';

export const deleteUserLikedPostsInputSchema = z.object({
  likedBy: z.string(),
  likedItem: z.string(),
});

export type DeleteUserLikedPostsInput = z.input<
  typeof deleteUserLikedPostsInputSchema
>;
