import { z } from 'zod';

export const baseCollectionSchema = z.object({
  id: z.string().min(1),
  created: z.string().or(z.date()),
  updated: z.string().or(z.date()).optional(),
});
