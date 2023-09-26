import { z } from 'zod';
import { baseCollectionSchema } from '../base.collection.schema';
import { zodSlug } from '../zodSlug';
import { defaultGetManySchema } from '../base.get-many.schema';

export const productCategorySchema = baseCollectionSchema.extend({
  name: z.string().trim().min(1, 'Název je povinný'),
  slug: zodSlug,
});

export const createProductCategorySchema = productCategorySchema.omit({
  created: true,
  id: true,
  updated: true,
});

export const getManyProductCategoriesSchema = defaultGetManySchema
  .omit({ perPage: true })
  .extend({
    perPage: z.number().min(1).default(99).optional(),
  });

export type ProductCategory = z.infer<typeof productCategorySchema>;
