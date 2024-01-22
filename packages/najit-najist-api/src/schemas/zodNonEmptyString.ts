import { z } from 'zod';

export const zodNonEmptyString = z
  .string({ required_error: 'Požadovaná hodnota' })
  .min(1, 'Požadovaná hodnota');
