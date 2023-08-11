import { z } from 'zod';
import { baseCollectionSchema } from './base.collection.schema';
import { municipalitySchema } from './municipality.schema';

export const addressSchema = baseCollectionSchema.extend({
  municipality: municipalitySchema,
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
