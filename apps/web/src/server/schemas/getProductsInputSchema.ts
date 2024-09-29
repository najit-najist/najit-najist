import { slugSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { defaultGetManySchema } from './base.get-many.schema';

export const getProductsInputSchema = defaultGetManySchema
  .omit({ page: true })
  .extend({
    cursor: z.string().optional(),
    categorySlug: z.array(slugSchema).optional(),
    sortBy: z
      .object({
        price: z.enum(['asc', 'desc']).optional(),
      })
      .optional(),
  });
