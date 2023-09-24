import { baseCollectionSchema } from '../base.collection.schema';
import { defaultGetManySchema } from '../base.get-many.schema';
import { zodImage } from '../zodImage';
import { z } from 'zod';
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
import { zodPublishedAt } from '../zodPublishedAt';
import { zodSlug } from '../zodSlug';

export const productSchema = baseCollectionSchema.extend({
  name: z.string().min(1, 'Toto pole je povinné').trim(),
  slug: zodSlug,
  images: z.array(zodImage).min(1, 'Toto pole je povinné'),
  description: z.string().trim().nullish(),
  category: productCategorySchema.optional(),
  publishedAt: zodPublishedAt,
  price: productPriceSchema,
  stock: productStockSchema,
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
    stock: createProductStockSchema.omit({ product: true }),
  });

export const updateProductSchema = createProductSchema
  .omit({
    price: true,
    stock: true,
  })
  .extend({
    price: updateProductPriceSchema,
    stock: updateProductStockSchema,
  })
  .partial();

export const getManyProductsSchema = defaultGetManySchema;
export const getOneProductSchema = productSchema
  .pick({ id: true })
  .or(productSchema.pick({ slug: true }));

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type GetManyProducts = z.infer<typeof getManyProductsSchema>;
export type GetOneProduct = z.infer<typeof getOneProductSchema>;
