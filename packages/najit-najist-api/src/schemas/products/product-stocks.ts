import { z } from 'zod';
import { baseCollectionSchema } from '../base.collection.schema';

export const productStockSchema = baseCollectionSchema.extend({
  count: z
    .number({ required_error: 'Toto pole je povinné' })
    .min(0, 'Minimální hodnota je 0'),
});

export const createProductStockSchema = productStockSchema
  .extend({ product: z.string() })
  .omit({
    // Default
    id: true,
    created: true,
    updated: true,
  });

export const updateProductStockSchema = createProductStockSchema
  .omit({ product: true })
  .partial()
  .extend({ id: z.string().min(1) });

export type ProductStock = z.infer<typeof productStockSchema>;
export type CreateProductStock = z.infer<typeof createProductStockSchema>;
export type UpdateProductStock = z.infer<typeof updateProductStockSchema>;
