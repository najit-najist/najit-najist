import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const recipeStepCreateInputSchema = z.object({
  title: nonEmptyStringSchema,
  parts: z.array(
    z.object({
      content: nonEmptyStringSchema,
      duration: z.number().min(0),
    }),
  ),
});
