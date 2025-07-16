import { UserRoles } from '@najit-najist/database/models';
import {
  encodedImageSchema,
  nonEmptyStringSchema,
  telephoneNumberInputSchema,
} from '@najit-najist/schemas';
import { passwordZodSchema } from '@najit-najist/security';
import { z } from 'zod';

import { userAddressCreateInputSchema } from './userAddressCreateInputSchema';

export const userCreateInputSchema = z.object({
  email: nonEmptyStringSchema.email().toLowerCase(),
  firstName: nonEmptyStringSchema.max(256),
  lastName: nonEmptyStringSchema.max(256),
  avatar: encodedImageSchema.nullable().optional(),
  role: z.nativeEnum(UserRoles),
  telephone: z.object({ telephone: telephoneNumberInputSchema }),
  address: userAddressCreateInputSchema,
  password: passwordZodSchema,
  newsletter: z.boolean().nullable().optional(),
});
