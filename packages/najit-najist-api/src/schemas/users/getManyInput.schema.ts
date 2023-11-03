import { municipalitySchema } from 'schemas/municipality.schema';
import { defaultGetManySchema } from '../base.get-many.schema';
import { z } from 'zod';

export const getManyUsersInputFilterSchema = z.object({
  address: z.array(municipalitySchema.pick({ id: true })).optional(),
});

export const getManyInputSchema = defaultGetManySchema.extend({
  filter: getManyUsersInputFilterSchema.optional(),
});
export type GetManyUsersOptions = z.infer<typeof getManyInputSchema>;
