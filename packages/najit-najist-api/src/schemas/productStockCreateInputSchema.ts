import { z } from 'zod';

export const productStockCreateInputSchema = z.object({
  count: z
    .number({ required_error: 'Toto pole je povinné' })
    .min(0, 'Minimální hodnota je 0'),
});
