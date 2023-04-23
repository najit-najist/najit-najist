import { z } from 'zod';

export const outputPostSchema = z.object({
  title: z.string(),
  created: z.string().transform((item) => new Date(item)),
  updated: z.string().transform((item) => new Date(item)),
  publishedAt: z
    .string()
    .nullable()
    .transform((item) => (item ? new Date(item) : item))
    .optional(),
  slug: z.string(),
  content: z.record(z.any()).optional(),
});
