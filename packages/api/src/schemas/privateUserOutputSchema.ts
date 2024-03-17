import { z } from 'zod';

import { userAddressCreateInputSchema } from './userAddressCreateInputSchema';
import { userCreateInputSchema } from './userCreateInputSchema';

export const privateUserOutputSchema = userCreateInputSchema
  .omit({
    password: true,
    telephone: true,
  })
  .extend({
    lastLoggedIn: z.date().optional().nullable(),
    createdAt: z.date().optional().nullable(),
    telephone: z
      .object({
        telephone: z.string(),
      })
      .nullable()
      .optional(),

    address: userAddressCreateInputSchema.nullable().optional(),
  });
