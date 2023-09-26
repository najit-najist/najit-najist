import { z } from 'zod';

export const getManyPostsInputSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  perPage: z.number().min(1).default(20).optional(),
  query: z.string().optional(),
});

export type GetManyPostsOptions = z.infer<typeof getManyPostsInputSchema>;
