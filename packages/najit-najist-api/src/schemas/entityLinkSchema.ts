import { nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const entityLinkSchema = z.object({
  id: nonEmptyStringSchema,
});
