import { z } from 'zod';

export const defaultGetManySchema = z.object({
  page: z.string().optional(),
  perPage: z.number().min(1).default(20),
  search: z.string().optional(),
});

export const defaultGetManyPagedSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).default(20),
  search: z.string().optional(),
});
