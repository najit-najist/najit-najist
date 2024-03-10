import { userAddressCreateInputSchema } from './userAddressCreateInputSchema';
import { userCreateInputSchema } from './userCreateInputSchema';

export const userUpdateInputSchema = userCreateInputSchema
  .omit({ password: true, address: true })
  .extend({
    address: userAddressCreateInputSchema.partial().optional(),
  })
  .partial();
