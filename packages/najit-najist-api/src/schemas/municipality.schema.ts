import { z } from 'zod';

export const municipalitySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export type Municipality = z.infer<typeof municipalitySchema>;
