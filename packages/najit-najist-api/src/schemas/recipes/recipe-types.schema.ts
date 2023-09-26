import { z } from 'zod';
import { defaultGetManySchema } from '../base.get-many.schema';
import { entrySchema } from '../entry.schema';
import { zodSlug } from '../zodSlug';

export const recipeTypeSchema = entrySchema.extend({
  title: z.string().trim().min(1, 'Název je povinný'),
  slug: zodSlug,
});

export const createRecipeTypeInputSchema = recipeTypeSchema.omit({
  created: true,
  id: true,
  slug: true,
  updated: true,
});

export const getManyRecipeTypesSchema = defaultGetManySchema
  .omit({ perPage: true })
  .extend({
    perPage: z.number().min(1).default(99).optional(),
  });

export type CreateRecipeTypeInput = z.infer<typeof createRecipeTypeInputSchema>;
export type GetManyRecipeTypes = z.infer<typeof getManyRecipeTypesSchema>;
export type RecipeType = z.infer<typeof recipeTypeSchema>;
