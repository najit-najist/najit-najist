import { nonEmptyStringSchema, slugSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const recipeDifficultyCreateInputSchema = z.object({
  name: nonEmptyStringSchema,
  color: nonEmptyStringSchema,
});
