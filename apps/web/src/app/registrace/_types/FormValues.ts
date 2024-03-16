import { userRegisterInputSchema } from '@najit-najist/api';
import { z } from 'zod';

export type FormValues = z.infer<typeof userRegisterInputSchema> & {
  passwordAgain: string;
};
