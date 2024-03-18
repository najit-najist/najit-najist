import { users } from '@najit-najist/database/models';
import { createSelectSchema } from 'drizzle-zod';

import { nonEmptyStringSchema } from '../nonEmptyStringSchema';
import { telephoneNumberSchema } from './telephoneNumberSchema';
import { userAddressSchema } from './userAddressSchema';

export const userSchema = createSelectSchema(users, {
  firstName: nonEmptyStringSchema,
  lastName: nonEmptyStringSchema,
}).extend({
  address: userAddressSchema,
  telephoneNumber: telephoneNumberSchema,
});
