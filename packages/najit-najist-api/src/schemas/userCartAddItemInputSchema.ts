import { z } from 'zod';

import { entityLinkSchema } from './entityLinkSchema';

export const userCartAddItemInputSchema = z.object({
  product: entityLinkSchema,
  count: z.number().min(1).default(1),
});
