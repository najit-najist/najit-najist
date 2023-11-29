import { z } from 'zod';

import { baseCollectionSchema } from './base.collection.schema';
import { municipalitySchema } from './municipality.schema';

export const addressStreetNameSchema = z
  .string({
    required_error: 'Vyplňte název ulice',
  })
  .refine(
    (value) => !/\d/.test(value),
    'Zadejte název ulice bez čísla popisného'
  );

export const addressSchema = baseCollectionSchema.extend({
  municipality: municipalitySchema,
  houseNumber: z.string().optional(),
  streetName: addressStreetNameSchema.optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

export const updateAddressSchema = addressSchema
  .omit({
    created: true,
    updated: true,
    municipality: true,
  })
  .extend({
    municipality: municipalitySchema.pick({ id: true }).optional(),
  });

export const createAddressSchema = addressSchema
  .omit({
    created: true,
    updated: true,
    municipality: true,
    id: true,
  })
  .extend({
    municipality: municipalitySchema.pick({ id: true }),
  });

export type Address = z.infer<typeof addressSchema>;
export type UpdateAddress = z.infer<typeof updateAddressSchema>;
