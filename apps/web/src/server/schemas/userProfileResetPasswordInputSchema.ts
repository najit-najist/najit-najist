import { passwordZodSchema } from '@najit-najist/security';
import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export const finalizeResetPasswordSchema = z.object({
  token: z.string(),
  password: passwordZodSchema,
});
