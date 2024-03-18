import { streetNameSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const userAddressCreateInputSchema = z.object({
  municipality: entityLinkSchema,
  houseNumber: z.string().nullable().optional(),
  streetName: streetNameSchema.nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
});
