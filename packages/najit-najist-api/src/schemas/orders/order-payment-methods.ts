import { PaymentMethodsSlug } from '@najit-najist/pb';
import { z } from 'zod';

import { baseCollectionSchema } from '../base.collection.schema';

export const orderPaymentMethodSchema = baseCollectionSchema.extend({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  slug: z.string().or(z.nativeEnum(PaymentMethodsSlug)),
  notes: z.string().optional(),
  payment_on_checkout: z.boolean().default(false),
  // FIXME: We cannot reference delivery method in here, but have to create it complicated like this
  except_delivery_methods: z.array(z.string()),
});

export type OrderPaymentMethod = z.infer<typeof orderPaymentMethodSchema>;
