import { addressSchema } from './address.schema';
import { municipalitySchema } from './municipality.schema';
import { createUserSchema } from './users';

export const userUpdateInputSchema = createUserSchema
  .omit({ password: true, address: true })
  .extend({
    address: addressSchema.pick({ id: true }).extend({
      municipality: municipalitySchema.pick({ id: true }),
    }),
  })
  .partial();
