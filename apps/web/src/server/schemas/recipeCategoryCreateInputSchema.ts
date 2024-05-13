import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const recipeCategoryCreateInputSchema = z.object({
  title: nonEmptyStringSchema,
});
