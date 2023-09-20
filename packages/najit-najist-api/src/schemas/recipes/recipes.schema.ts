import { entrySchema } from '../entry.schema';
import { z } from 'zod';
import { zodImage } from '../zodImage';
import { defaultGetManySchema } from '../base.get-many.schema';
import { recipeTypeSchema } from './recipe-types.schema';
import { recipeDifficultySchema } from './recipe-difficulty.schema';
import { recipeResourceSchema } from './recipe-resources.schema';
import { recipeStepGroupSchema } from './recipe-step-groups.schema';

export const recipeSchema = entrySchema.extend({
  title: z
    .string({ required_error: 'Vyžadováno' })
    .trim()
    .min(1, 'Název je povinný'),
  slug: z.string().trim(),
  images: z.array(zodImage).min(1, 'Toto pole je povinné'),
  description: z
    .string({ required_error: 'Toto pole je povinné' })
    .describe('A html description'),
  type: recipeTypeSchema,
  numberOfPortions: z.number({ required_error: 'Toto pole je povinné' }).min(1),
  resources: z.array(recipeResourceSchema).min(1, 'Alespoň jedna ingredience'),
  steps: z.array(recipeStepGroupSchema).min(1, 'Alespoň jeden krok'),
  difficulty: recipeDifficultySchema,
});

export const createRecipeInputSchema = recipeSchema
  .omit({
    type: true,
    difficulty: true,
    created: true,
    id: true,
    slug: true,
    updated: true,
  })
  .extend({
    type: z
      .string({ required_error: 'Toto pole je povinné' })
      .min(1, 'Toto pole je povinné'),
    difficulty: z
      .string({ required_error: 'Toto pole je povinné' })
      .min(1, 'Toto pole je povinné'),
  });

export const updateRecipeInputSchema = recipeSchema
  .omit({
    type: true,
    difficulty: true,
    created: true,
    id: true,
    slug: true,
    updated: true,
  })
  .extend({
    type: z.string(),
    difficulty: z.string(),
  })
  .partial();

export const getManyRecipesSchema = defaultGetManySchema.extend({
  typeSlug: z.string().optional(),
  difficultySlug: z.string().optional(),
});

export const getOneRecipeInputSchema = z.object({
  where: z.object({
    id: z.string(),
  }),
});

export const likeRecipeInputSchema = recipeSchema.pick({ id: true });
export const dislikeRecipeInputSchema = z.object({
  itemId: z.string(),
});

export type UpdateRecipeInput = z.infer<typeof updateRecipeInputSchema>;
export type LikedRecipeInput = z.infer<typeof likeRecipeInputSchema>;
export type DislikedRecipeInput = z.infer<typeof dislikeRecipeInputSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>;
export type GetOneRecipeInput = z.infer<typeof getOneRecipeInputSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type GetManyRecipes = z.infer<typeof getManyRecipesSchema>;
