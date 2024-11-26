import { productCreateInputSchema } from './productCreateInputSchema';
import { productStockCreateInputSchema } from './productStockCreateInputSchema';

export const productUpdateInputSchema = productCreateInputSchema
  .partial()
  .omit({
    stock: true,
  })
  .extend({
    stock: productStockCreateInputSchema.partial().nullable().optional(),
  });
