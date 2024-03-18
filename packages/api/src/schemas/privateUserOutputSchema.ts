import { UserStates } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { userAddressCreateInputSchema } from './userAddressCreateInputSchema';
import { userCreateInputSchema } from './userCreateInputSchema';

export const privateUserOutputSchema = userCreateInputSchema
  .omit({
    password: true,
    telephone: true,
  })
  .extend({
    id: z.number(),
    status: z.nativeEnum(UserStates).nullable(),
    lastLoggedIn: z.date().optional().nullable(),
    createdAt: z.date().optional().nullable(),
    telephone: z
      .object({
        telephone: z.string(),
      })
      .nullable()
      .optional(),

    address: userAddressCreateInputSchema
      .omit({ municipality: true })
      .extend({
        id: z.number(),
        municipality: entityLinkSchema.extend({ name: z.string() }),
      })
      .nullable()
      .optional(),
  });
