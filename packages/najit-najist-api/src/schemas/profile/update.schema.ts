import { createAddressSchema, updateAddressSchema } from '../address.schema';
import { zodImage } from '../zodImage';
import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: zodImage.optional(),
  address: updateAddressSchema.or(createAddressSchema).optional(),
});

export type UpdateProfile = z.input<typeof updateProfileSchema>;
