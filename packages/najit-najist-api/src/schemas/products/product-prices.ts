import { z } from 'zod';
import { baseCollectionSchema } from '../base.collection.schema';

export const productPriceSchema = baseCollectionSchema.extend({
  value: z
    .string({ required_error: 'Toto pole je povinné' })
    .transform((value) => (Number.isNaN(Number(value)) ? Number(value) : -1))
    .or(z.number())
    .refine((value) => value >= 0, 'Minimální hodnota je 0'),
  discount: z
    .number({ required_error: 'Toto pole je povinné' })
    .min(0, 'Minimální hodnota je 0')
    .nullish()
    .default(0),
});

export const createProductPriceSchema = productPriceSchema
  .extend({ product: z.string() })
  .omit({
    // Default
    id: true,
    created: true,
    updated: true,
  });

export const updateProductPriceSchema = createProductPriceSchema
  .omit({ product: true })
  .partial()
  .extend({ id: z.string().min(1) });

export type ProductPrice = z.infer<typeof productPriceSchema>;
export type CreateProductPrice = z.infer<typeof createProductPriceSchema>;
