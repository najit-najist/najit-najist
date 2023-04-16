import { registerInputSchema } from '@najit-najist/api';
import { z } from 'zod';

export type FormValues = z.infer<typeof registerInputSchema> & {
  passwordAgain: string;
};
