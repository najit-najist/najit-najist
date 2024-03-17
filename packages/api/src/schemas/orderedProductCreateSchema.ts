import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const orderedProductCreateSchema = z.object({
  count: z.number(),
  product: entityLinkSchema,
  order: z.number(),
  totalPrice: z.number(),
});
