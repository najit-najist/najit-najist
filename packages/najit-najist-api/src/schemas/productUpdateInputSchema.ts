import { z } from 'zod';

import { productCreateInputSchema } from './productCreateInputSchema';
import { productPriceCreateInputSchema } from './productPriceCreateInputSchema';
import { productStockCreateInputSchema } from './productStockCreateInputSchema';

export const productUpdateInputSchema = productCreateInputSchema
  .partial()
  .omit({
    price: true,
    stock: true,
  })
  .extend({
    price: productPriceCreateInputSchema.partial().optional(),
    stock: productStockCreateInputSchema.partial().nullable().optional(),
  });
