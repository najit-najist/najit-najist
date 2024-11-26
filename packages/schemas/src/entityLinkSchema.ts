import { z } from 'zod';

export const entityLinkSchema = z.object(
  {
    id: z.number({ required_error: 'Požadováno' }).min(1, 'Požadováno'),
  },
  { required_error: 'Požadováno' },
);

export type EntityLink = z.infer<typeof entityLinkSchema>;
