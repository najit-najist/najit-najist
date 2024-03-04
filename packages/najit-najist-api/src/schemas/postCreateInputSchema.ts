import {
  encodedImageSchema,
  stringOrDateToDateSchema,
} from '@najit-najist/schemas';
import { z } from 'zod';

export const postCreateInputSchema = z.object({
  title: z.string().min(2, 'Minimálně dva znaky'),
  publishedAt: stringOrDateToDateSchema,
  content: z.record(z.any()).optional(),
  description: z.string().min(2, 'Minimálně dva znaky'),
  image: encodedImageSchema.optional(),
});
