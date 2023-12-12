import { z } from 'zod';

import { baseCollectionSchema } from '../base.collection.schema';
import { municipalitySchema } from '../municipality.schema';
import { userSchema } from '../user.schema';
import { zodTelephoneNumber } from '../zodTelephoneNumber';
import { orderDeliveryMethodSchema } from './order-delivery-methods';
import { orderPaymentMethodSchema } from './order-payment-methods';
import { orderProductSchema } from './order-products';

export const orderStates = z.enum([
  'new',
  'unpaid',
  'unconfirmed',
  'confirmed',
  'finished',
  'dropped',
  'shipped',
]);

export const orderSchema = baseCollectionSchema.extend({
  subtotal: z.number(),

  address_houseNumber: z.string(),
  address_streetName: z.string(),
  address_city: z.string(),
  address_postalCode: z.string(),
  address_municipality: municipalitySchema,

  email: z.string().email(),
  telephoneNumber: zodTelephoneNumber,

  firstName: z.string(),
  lastName: z.string(),

  payment_method: orderPaymentMethodSchema,
  delivery_method: orderDeliveryMethodSchema,
  products: z.array(orderProductSchema),
  user: userSchema.omit({ address: true }).optional(),

  state: orderStates,
});

export type Order = z.infer<typeof orderSchema>;
