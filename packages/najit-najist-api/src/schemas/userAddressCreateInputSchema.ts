import { streetNameSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const userAddressCreateInputSchema = z.object({
  municipality: entityLinkSchema,
  houseNumber: z.string().optional(),
  streetName: streetNameSchema.optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});
