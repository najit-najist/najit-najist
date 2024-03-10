import {
  encodedImageSchema,
  slugSchema,
  stringOrDateToDateSchema,
} from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { productPriceCreateInputSchema } from './productPriceCreateInputSchema';
import { productStockCreateInputSchema } from './productStockCreateInputSchema';

export const productCreateInputSchema = z.object({
  name: z.string().min(1, 'Toto pole je povinné').trim(),
  slug: slugSchema,
  images: z.array(encodedImageSchema).min(1, 'Toto pole je povinné'),
  description: z.string().trim().nullish(),
  category: entityLinkSchema.optional(),
  onlyDeliveryMethods: z.array(z.string()).default([]),
  publishedAt: stringOrDateToDateSchema,
  price: productPriceCreateInputSchema,
  stock: productStockCreateInputSchema.nullable().optional(),
});
