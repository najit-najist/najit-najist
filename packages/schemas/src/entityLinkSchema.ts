import { z } from 'zod';

export const entityLinkSchema = z.object({
  id: z.number().min(0),
});

export type EntityLink = z.infer<typeof entityLinkSchema>;
