import { z } from 'zod';

export const defaultGetManySchema = z.object({
  page: z.number().min(1).default(1).optional(),
  perPage: z.number().min(1).default(20).optional(),
  search: z.string().optional(),
});
