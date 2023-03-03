import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  telephoneNumber: z.string().optional(),
  newsletter: z.boolean().default(true),
});
