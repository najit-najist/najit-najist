import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const recipeResourceCreateInputSchema = z.object({
  count: z.number(),
  metric: entityLinkSchema,
  title: nonEmptyStringSchema,
  description: z.string().optional(),
  isOptional: z.boolean().default(false),
});
