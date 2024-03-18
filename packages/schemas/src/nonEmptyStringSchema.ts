import { z } from 'zod';

export const nonEmptyStringSchema = z
  .string({ required_error: 'Požadovaná hodnota' })
  .trim()
  .min(1, 'Požadovaná hodnota');
