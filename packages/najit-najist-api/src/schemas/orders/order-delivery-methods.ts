import { z } from 'zod';

import { baseCollectionSchema } from '../base.collection.schema';
import { orderPaymentMethodSchema } from './order-payment-methods';

export const orderDeliveryMethodSchema = baseCollectionSchema.extend({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  paymentMethods: z.array(orderPaymentMethodSchema),
});

export type DeliveryMethod = z.infer<typeof orderDeliveryMethodSchema>;
