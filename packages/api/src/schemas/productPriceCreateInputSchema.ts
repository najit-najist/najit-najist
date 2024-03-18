import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const productPriceCreateInputSchema = z.object({
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
  product: entityLinkSchema,
});
