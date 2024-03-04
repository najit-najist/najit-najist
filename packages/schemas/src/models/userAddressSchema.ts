import { userAddresses } from '@najit-najist/database/models';
import { createSelectSchema } from 'drizzle-zod';

export const userAddressSchema = createSelectSchema(userAddresses);
