import { defaultGetManySchema } from '../base.get-many.schema';
import { z } from 'zod';

export const getManyInputSchema = defaultGetManySchema.extend({
  typeSlug: z.string().optional(),
  difficultySlug: z.string().optional(),
});

export type GetManyUsersOptions = z.infer<typeof getManyInputSchema>;
