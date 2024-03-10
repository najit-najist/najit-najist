import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const userCartUpdateInputSchema = z.object({
  product: entityLinkSchema,
  count: z.number().min(1).default(1),
});
