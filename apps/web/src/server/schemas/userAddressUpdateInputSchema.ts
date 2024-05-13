import { userAddressCreateInputSchema } from './userAddressCreateInputSchema';

export const userAddressUpdateInputSchema =
  userAddressCreateInputSchema.partial();
