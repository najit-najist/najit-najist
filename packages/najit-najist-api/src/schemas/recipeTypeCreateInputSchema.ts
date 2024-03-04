import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const recipeTypeCreateInputSchema = z.object({
  title: nonEmptyStringSchema,
});
