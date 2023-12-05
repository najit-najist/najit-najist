import { z } from 'zod';

import { baseCollectionSchema } from '../base.collection.schema';

export const orderPaymentMethodSchema = baseCollectionSchema.extend({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  notes: z.string().optional(),
  payment_on_checkout: z.boolean().default(false),
  // FIXME: We cannot reference delivery method in here, but have to create it complicated like this
  delivery_method: z.string().or(
    baseCollectionSchema.extend({
      name: z.string(),
      slug: z.string(),
      description: z.string(),
      notes: z.string().optional(),
      price: z.number().default(0),
    })
  ),
});

export type OrderPaymentMethod = z.infer<typeof orderPaymentMethodSchema>;
