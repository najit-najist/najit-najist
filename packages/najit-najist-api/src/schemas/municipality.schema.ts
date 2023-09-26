import { z } from 'zod';
import { baseCollectionSchema } from './base.collection.schema';
import { zodSlug } from './zodSlug';

export const municipalitySchema = baseCollectionSchema.extend({
  name: z.string().min(1),
  slug: zodSlug,
});

export const getManyMunicipalitySchema = z.object({
  query: z.string().optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(10).max(100).default(10),
});

export type Municipality = z.infer<typeof municipalitySchema>;
