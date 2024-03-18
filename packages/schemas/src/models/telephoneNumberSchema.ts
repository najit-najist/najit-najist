import { telephoneNumbers } from '@najit-najist/database/models';
import { createSelectSchema } from 'drizzle-zod';

export const telephoneNumberSchema = createSelectSchema(telephoneNumbers);
