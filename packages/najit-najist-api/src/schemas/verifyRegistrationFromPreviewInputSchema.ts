import { entityLinkSchema } from '@najit-najist/schemas';
import { passwordZodSchema } from '@najit-najist/security';
import { z } from 'zod';

export const verifyRegistrationFromPreviewInputSchema = z.object({
  token: z.string(),
  password: passwordZodSchema,
  address: z.object({
    municipality: entityLinkSchema,
  }),
});
