import { municipalities } from '@najit-najist/database/models';
import { createSelectSchema } from 'drizzle-zod';

export const municipalitySchema = createSelectSchema(municipalities);
