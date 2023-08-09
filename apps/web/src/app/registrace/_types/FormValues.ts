import { registerUserSchema } from '@najit-najist/api';
import { z } from 'zod';

export type FormValues = z.infer<typeof registerUserSchema> & {
  passwordAgain: string;
};
