import { z } from 'zod';

export const loginOutputSchema = z.object({
  token: z.string(),
});
