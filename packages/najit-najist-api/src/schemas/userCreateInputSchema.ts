import { passwordZodSchema } from '@najit-najist/security';
import { z } from 'zod';

import { municipalitySchema } from './municipality.schema';
import { userSchema } from './user.schema';

export const userCreateInputSchema = userSchema
  .omit({
    lastLoggedIn: true,
    newsletterUuid: true,
    role: true,
    status: true,
  })
  .extend({
    address: z.object({
      municipality: municipalitySchema.pick({ id: true }),
    }),
    password: passwordZodSchema,
  });
