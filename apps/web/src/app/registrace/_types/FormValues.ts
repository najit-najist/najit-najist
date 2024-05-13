import { userRegisterInputSchema } from '@server/schemas/userRegisterInputSchema';
import { z } from 'zod';

export type FormValues = z.infer<typeof userRegisterInputSchema> & {
  passwordAgain: string;
};
