import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.string(),
  password: z.string(),
});
