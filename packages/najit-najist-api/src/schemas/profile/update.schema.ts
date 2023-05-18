import { z } from 'zod';

export const updateUserInputSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
