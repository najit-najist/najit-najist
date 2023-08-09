import { z } from 'zod';
import { municipalitySchema } from './municipality.schema';

export const addressSchema = z.object({
  municipality: municipalitySchema,
});

export type Address = z.infer<typeof addressSchema>;
