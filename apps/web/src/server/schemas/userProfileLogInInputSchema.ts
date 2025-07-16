import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const userProfileLogInInputSchema = z.object({
  email: z.string().email('Zadejte správný email').toLowerCase(),
  password: nonEmptyStringSchema,
});
