import { z } from 'zod';

export const createPostInputSchema = z.object({
  title: z.string().min(2, 'Minimálně dva znaky'),
  publishedAt: z.string().nullable().optional(),
  content: z.record(z.any()).optional(),
  description: z.string().min(2, 'Minimálně dva znaky'),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
