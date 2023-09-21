import { baseCollectionSchema } from '../base.collection.schema';
import { zodPublishedAt } from '../zodPublishedAt';
import { z } from 'zod';

export const outputPostSchema = baseCollectionSchema.extend({
  title: z.string(),
  created: z.string().transform((item) => new Date(item)),
  updated: z.string().transform((item) => new Date(item)),
  publishedAt: zodPublishedAt,
  slug: z.string(),
  content: z.record(z.any()).optional(),
});
