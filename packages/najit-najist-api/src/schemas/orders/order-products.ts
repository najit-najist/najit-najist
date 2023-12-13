import { z } from 'zod';

import { baseCollectionSchema } from '../base.collection.schema';
import { productSchema } from '../products';

export const orderProductSchema = baseCollectionSchema.extend({
  count: z.number(),
  product: productSchema,
  order: z.number(),
  totalPrice: z.number(),
});

export type OrderProduct = z.infer<typeof orderProductSchema>;
