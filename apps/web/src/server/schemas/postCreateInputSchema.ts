import {
  encodedImageSchema,
  stringOrDateToDateSchema,
} from '@najit-najist/schemas';
import { z } from 'zod';

export const postCreateInputSchema = z.object({
  title: z.string().min(2, 'Minimálně dva znaky'),
  publishedAt: stringOrDateToDateSchema,
  content: z.string().nullable().optional(),
  description: z.string().min(2, 'Minimálně dva znaky'),
  image: encodedImageSchema.nullable().optional(),
});
