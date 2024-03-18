import { encodedImageSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { userAddressUpdateInputSchema } from './userAddressUpdateInputSchema';

export const userProfileUpdateInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: encodedImageSchema.nullable().optional(),
  address: userAddressUpdateInputSchema.optional(),
  newsletter: z.boolean().optional(),
});
