import { z } from 'zod';

export const productStockCreateInputSchema = z.object({
  value: z
    .number({ required_error: 'Toto pole je povinné' })
    .min(0, 'Minimální hodnota je 0'),
});
