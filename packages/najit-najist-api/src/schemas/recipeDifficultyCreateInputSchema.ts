import { nonEmptyStringSchema, slugSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const createRecipeDifficultyInputSchema = z.object({
  name: nonEmptyStringSchema,
  color: nonEmptyStringSchema,
  slug: slugSchema,
});
