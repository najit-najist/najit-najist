import { z } from 'zod';

export const getOneUserInputSchema = z.object({
  where: z
    .object({
      id: z.string(),
    })
    .or(z.object({ preregisteredUserToken: z.string() })),
});

export type GetOneUserOptions = z.infer<typeof getOneUserInputSchema>;
