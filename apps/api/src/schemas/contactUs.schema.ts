import { z } from 'zod';

export const contactUsSchema = z.object({
  name: z.string(),
  telephone: z.string(),
  email: z.string().email(),
  message: z.string(),
});
