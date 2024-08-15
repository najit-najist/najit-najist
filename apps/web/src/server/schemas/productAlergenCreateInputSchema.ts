import { z } from 'zod';

import { defaultGetManySchema } from './base.get-many.schema';

export const productAlergenCreateInputSchema = defaultGetManySchema
  .omit({ perPage: true })
  .extend({
    perPage: z.number().min(1).default(99).optional(),
    // omitEmpty: z.boolean().default(false),
  })
  .default({});
