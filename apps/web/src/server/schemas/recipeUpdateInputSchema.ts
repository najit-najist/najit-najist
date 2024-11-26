import { z } from 'zod';

import { recipeCreateInputSchema } from './recipeCreateInputSchema';
import { recipeResourceCreateInputSchema } from './recipeResourceCreateInputSchema';
import { recipeStepCreateInputSchema } from './recipeStepCreateInputSchema';

export const recipeUpdateInputSchema = recipeCreateInputSchema
  .omit({ steps: true, resources: true })
  .extend({
    resources: z
      .array(
        recipeResourceCreateInputSchema.extend({
          id: z
            .number()
            .nullable()
            .transform((val) => (val === null ? undefined : val))
            .optional(),
        }),
      )
      .min(1, 'Alespoň jedna ingredience'),
    steps: z
      .array(
        recipeStepCreateInputSchema.extend({
          id: z
            .number()
            .nullable()
            .transform((val) => (val === null ? undefined : val))
            .optional(),
        }),
      )
      .min(1, 'Alespoň jeden krok'),
  })
  .partial();
