import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const recipeResourceMetricCreateInputSchema = z.object({
  name: nonEmptyStringSchema,
});
