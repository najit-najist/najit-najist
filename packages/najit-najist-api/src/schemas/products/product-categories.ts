import { z } from 'zod';
import { baseCollectionSchema } from '../base.collection.schema';

export const productCategorySchema = baseCollectionSchema.extend({
  title: z.string().trim().min(1, 'Název je povinný'),
  slug: z.string().trim(),
});

export type ProductCategory = z.infer<typeof productCategorySchema>;