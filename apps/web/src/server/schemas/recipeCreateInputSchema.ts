import {
  encodedImageSchema,
  nonEmptyStringSchema,
} from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { recipeResourceCreateInputSchema } from './recipeResourceCreateInputSchema';
import { recipeStepCreateInputSchema } from './recipeStepCreateInputSchema';

export const recipeCreateInputSchema = z.object({
  title: nonEmptyStringSchema,
  images: z.array(encodedImageSchema).min(1, 'Toto pole je povinné'),
  numberOfPortions: z.number({ required_error: 'Toto pole je povinné' }).min(1),
  description: z.string({ required_error: 'Toto pole je povinné' }),
  category: entityLinkSchema,
  difficulty: entityLinkSchema,
  resources: z
    .array(recipeResourceCreateInputSchema)
    .min(1, 'Alespoň jedna ingredience'),
  steps: z.array(recipeStepCreateInputSchema).min(1, 'Alespoň jeden krok'),
});
