import { z } from 'zod';

export const baseCollectionSchema = z.object({
  id: z
    .string({
      required_error: 'Požadováno',
    })
    .min(1),
  created: z.string().or(z.date()),
  updated: z.string().or(z.date()).optional(),
});
