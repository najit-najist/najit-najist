import { z } from 'zod';

export const updateOnePostInputSchema = z.object({
  id: z.string(),
  data: z.object({
    title: z.string().optional(),
    publishedAt: z.string().nullable().optional(),
    content: z.record(z.any()).optional(),
    description: z.string().optional(),
  }),
});

export type UpdateOnePostInput = z.infer<typeof updateOnePostInputSchema>;
