import { z } from 'zod';

export const getOnePostInputSchema = z.object({
  slug: z.string(),
});
