import { z } from 'zod';

import { defaultGetManySchema } from '../base.get-many.schema';
import { municipalitySchema } from '../municipality.schema';

export const getManyUsersInputFilterSchema = z.object({
  address: z.array(municipalitySchema.pick({ id: true })).optional(),
});

export const getManyInputSchema = defaultGetManySchema.extend({
  filter: getManyUsersInputFilterSchema.optional(),
});
export type GetManyUsersOptions = z.infer<typeof getManyInputSchema>;
