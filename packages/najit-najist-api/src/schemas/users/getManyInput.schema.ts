import { z } from 'zod';

export const getManyInputSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  perPage: z.number().min(1).default(20).optional(),
  search: z.string().optional(),
  typeSlug: z.string().optional(),
  difficultySlug: z.string().optional(),
});

export type GetManyUsersOptions = z.infer<typeof getManyInputSchema>;
