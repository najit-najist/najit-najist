import { passwordZodSchema } from '@najit-najist/security';
import { userAddressCreateInputSchema } from '@server/schemas/userAddressCreateInputSchema';
import { userCreateInputSchema } from '@server/schemas/userCreateInputSchema';

export const createUserValidationSchema = userCreateInputSchema
  .omit({ password: true, address: true, telephone: true, role: true })
  .extend({
    address: userAddressCreateInputSchema,
    password: passwordZodSchema,
  });
