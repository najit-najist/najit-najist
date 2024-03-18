import { z } from 'zod';

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .transform(decodeURIComponent);
