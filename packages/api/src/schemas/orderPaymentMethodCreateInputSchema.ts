import { OrderPaymentMethodsSlugs } from '@najit-najist/database/models';
import { z } from 'zod';

export const orderPaymentMethodCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  slug: z.string().or(z.nativeEnum(OrderPaymentMethodsSlugs)),
  notes: z.string().optional(),
  payment_on_checkout: z.boolean().default(false),
  // FIXME: We cannot reference delivery method in here, but have to create it complicated like this
  except_delivery_methods: z.array(z.string()),
});
