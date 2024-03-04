import { z } from 'zod';

import { entityLinkSchema } from './entityLinkSchema';

export const orderedProductCreateSchema = z.object({
  count: z.number(),
  product: entityLinkSchema,
  order: z.number(),
  totalPrice: z.number(),
});
