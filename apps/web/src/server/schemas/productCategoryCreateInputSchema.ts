import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const productCategoryCreateInputSchema = z.object({
  name: nonEmptyStringSchema,
});
