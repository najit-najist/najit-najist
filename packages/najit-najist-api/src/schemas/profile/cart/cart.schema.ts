import { z } from 'zod';
import { baseCollectionSchema } from '../../base.collection.schema';
import { productSchema } from '../../products';

export const userCartProductSchema = baseCollectionSchema.extend({
  cart: z.string(),
  product: z.string().or(productSchema),
  count: z.number(),
});

export const userCartSchema = baseCollectionSchema.extend({
  user: z.string(),
  products: z.array(userCartProductSchema),
});

export const addToCartSchema = z.object({
  product: productSchema.pick({ id: true }),
  count: z.number().min(1).default(1),
});

export type UserCartProduct = z.infer<typeof userCartProductSchema>;
export type UserCart = z.infer<typeof userCartSchema>;
