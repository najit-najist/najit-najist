import { userRegisterInputSchema } from '@server/schemas/userRegisterInputSchema';
import { z } from 'zod';

export type FormValues = z.input<typeof userRegisterInputSchema> & {
  passwordAgain: string;
};
