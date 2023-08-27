import { z } from 'zod';

export const getManyRecipeResourceMetricInputSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  perPage: z.number().min(1).default(20).optional(),
});

export type GetManyRecipeResourceMetricInput = z.infer<
  typeof getManyRecipeResourceMetricInputSchema
>;
