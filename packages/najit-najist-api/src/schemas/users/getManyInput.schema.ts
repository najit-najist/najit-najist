import { defaultGetManySchema } from '../base.get-many.schema';
import { z } from 'zod';

export const getManyInputSchema = defaultGetManySchema;
export type GetManyUsersOptions = z.infer<typeof getManyInputSchema>;
