import {
  encodedImageSchema,
  stringOrDateToDateSchema,
} from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { productStockCreateInputSchema } from './productStockCreateInputSchema';

export const productCreateInputSchema = z.object({
  name: z.string().min(1, 'Toto pole je povinné').trim(),
  images: z
    .array(encodedImageSchema, { required_error: 'Toto pole je povinné' })
    .min(1, 'Toto pole je povinné'),
  description: z.string().trim().nullish(),
  category: entityLinkSchema.optional(),
  onlyForDeliveryMethod: entityLinkSchema.nullable().optional(),
  publishedAt: stringOrDateToDateSchema,
  price: z.coerce
    .number({ required_error: 'Požadovaná hodnota' })
    .min(0)
    .default(0),
  stock: productStockCreateInputSchema.nullable().optional(),
  weight: z
    .number({
      required_error: 'Váha je povinná',
    })
    .min(0, { message: 'Minimální váha je 0g' }),
  composedOf: z.array(
    z.object({
      id: z.coerce.number().nullish(),
      rawMaterial: entityLinkSchema.extend({
        name: z.string().nullish(),
      }),
      notes: z.string().nullish(),
      description: z.string().nullish(),
      order: z.number(),
    }),
  ),
  alergens: z.array(
    z.object({
      id: z.coerce.number(),
      name: z.string().nullish(),
      description: z.string().nullish(),
    }),
  ),
});
