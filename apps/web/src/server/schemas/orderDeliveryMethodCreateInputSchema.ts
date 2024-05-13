import { z } from 'zod';

export const orderDeliveryMethodCreateInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  price: z.number().default(0),
  description: z.string(),
  notes: z.string().optional(),
});
