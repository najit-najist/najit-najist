import { z } from 'zod';

import { baseCollectionSchema } from '../base.collection.schema';

export const orderDeliveryMethodSchema = baseCollectionSchema.extend({
  name: z.string(),
  slug: z.string(),
  price: z.number().default(0),
  description: z.string(),
  notes: z.string().optional(),
});

export type DeliveryMethod = z.infer<typeof orderDeliveryMethodSchema>;
