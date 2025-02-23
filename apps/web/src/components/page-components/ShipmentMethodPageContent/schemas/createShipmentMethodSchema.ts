import { z } from 'zod';

export const createShipmentMethodSchema = z.object({
  notes: z.string().nullish(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  price: z.number(),
});
