import { z } from 'zod';

export const updateOnePostInputSchema = z.object({
  title: z.string().optional(),
  publishedAt: z.date().optional(),
  content: z.record(z.any()).optional(),
  description: z.string().optional(),
});

export type UpdateOnePostInput = z.infer<typeof updateOnePostInputSchema>;
