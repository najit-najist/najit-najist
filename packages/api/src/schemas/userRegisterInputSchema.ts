import { entityLinkSchema } from '@najit-najist/schemas';
import { passwordZodSchema } from '@najit-najist/security';
import { z } from 'zod';

import { userCreateInputSchema } from './userCreateInputSchema';

export const userRegisterInputSchema = userCreateInputSchema
  .omit({
    role: true,
    status: true,
  })
  .extend({
    address: z.object({
      municipality: entityLinkSchema,
    }),
    password: passwordZodSchema,
  });
