import { z } from 'zod';

export const subscribeToNewsletterInputSchema = z.object({
  email: z.string().email().toLowerCase(),
});
