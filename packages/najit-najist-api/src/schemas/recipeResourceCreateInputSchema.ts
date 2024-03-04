import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const recipeResourceCreateInputSchema = z.object({
  count: z.number(),
  metric: z.string().trim(),
  title: nonEmptyStringSchema,
  description: z.string().optional(),
  isOptional: z.boolean().default(false),
});
