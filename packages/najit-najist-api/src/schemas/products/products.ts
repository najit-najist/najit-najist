import { baseCollectionSchema } from 'schemas/base.collection.schema';
import { defaultGetManySchema } from 'schemas/base.get-many.schema';
import { zodImage } from 'schemas/zodImage';
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

export const productSchema = baseCollectionSchema.extend({
  name: z.string().trim(),
  images: z.array(zodImage).min(1, 'Toto pole je povinné'),
  description: z.string().trim().nullish(),
  categories: z.array(productCategorySchema),
  price: productPriceSchema,
  stock: productStockSchema,
});

export const createProductSchema = productSchema
  .omit({
    categories: true,
    price: true,
    stock: true,
    // Default
    created: true,
    id: true,
    slug: true,
    updated: true,
  })
  .extend({
    categories: z.array(productCategorySchema.pick({ id: true })).optional(),
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
export const getOneProductSchema = productSchema.pick({ id: true });

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type GetManyProducts = z.infer<typeof getManyProductsSchema>;
export type GetOneProduct = z.infer<typeof getOneProductSchema>;
