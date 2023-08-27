import { z } from 'zod';

export const getManyRecipesInputSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  perPage: z.number().min(1).default(20).optional(),
});

export const getOneRecipeInputSchema = z.object({
  where: z.object({
    id: z.string(),
  }),
});

export type GetOneRecipeInput = z.infer<typeof getOneRecipeInputSchema>;
export type GetManyRecipesInput = z.infer<typeof getManyRecipesInputSchema>;
