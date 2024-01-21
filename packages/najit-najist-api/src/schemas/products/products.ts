import { z } from 'zod';

import { baseCollectionSchema } from '../base.collection.schema';
import { defaultGetManySchema } from '../base.get-many.schema';
import { zodImage } from '../zodImage';
import { zodPublishedAt } from '../zodPublishedAt';
import { zodSlug } from '../zodSlug';
import { productCategorySchema } from './product-categories';
import {
  createProductPriceSchema,
  productPriceSchema,
  updateProductPriceSchema,
} from './product-prices';
import {
  createProductStockSchema,
  productStockSchema,
  updateProductStockSchema,
} from './product-stocks';

export const productSchema = baseCollectionSchema.extend({
  name: z.string().min(1, 'Toto pole je povinné').trim(),
  slug: zodSlug,
  images: z.array(zodImage).min(1, 'Toto pole je povinné'),
  description: z.string().trim().nullish(),
  category: productCategorySchema.optional(),
  onlyDeliveryMethods: z.array(z.string()).default([]),
  publishedAt: zodPublishedAt,
  price: productPriceSchema,
  stock: productStockSchema.nullable().optional(),
});

export const createProductSchema = productSchema
  .omit({
    category: true,
    price: true,
    stock: true,
    // Default
    created: true,
    id: true,
    slug: true,
    updated: true,
  })
  .extend({
    category: productCategorySchema.pick({ id: true }).optional(),
    price: createProductPriceSchema.omit({ product: true }),
    stock: createProductStockSchema
      .omit({ product: true })
      .nullable()
      .optional(),
  });

export const updateProductSchema = createProductSchema
  .omit({
    price: true,
    stock: true,
  })
  .extend({
    price: updateProductPriceSchema,
    stock: updateProductStockSchema.nullable().optional(),
  })
  .partial();

export const getManyProductsSchema = defaultGetManySchema.extend({
  categorySlug: z.array(zodSlug).optional(),
});
export const getOneProductSchema = productSchema
  .pick({ id: true })
  .or(productSchema.pick({ slug: true }));

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type GetManyProducts = z.infer<typeof getManyProductsSchema>;
export type GetOneProduct = z.infer<typeof getOneProductSchema>;
