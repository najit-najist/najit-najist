import { z } from 'zod';
import { baseCollectionSchema } from '../base.collection.schema';
import { zodSlug } from '../zodSlug';

export const productCategorySchema = baseCollectionSchema.extend({
  title: z.string().trim().min(1, 'Název je povinný'),
  slug: zodSlug,
});

export type ProductCategory = z.infer<typeof productCategorySchema>;
