import { entrySchema } from '../entry.schema';
import { z } from 'zod';
import { zodImage } from 'schemas/zodImage';

export const recipeTypeSchema = entrySchema.extend({
  title: z.string().trim().min(1, 'Název je povinný'),
  slug: z.string().trim(),
});

export const recipeResourceMetricSchema = entrySchema.extend({
  name: z.string().trim().min(1, 'Název je povinný'),
});

export const recipeDifficultySchema = entrySchema.extend({
  name: z.string().trim().min(1, 'Název je povinný'),
  color: z.string(),
  slug: z.string().trim(),
});

export const recipeResourceSchema = z.object({
  count: z.number(),
  metric: z.string().trim(),
  title: z.string().trim().min(1, 'Název je povinný'),
  description: z.string().optional(),
  isOptional: z.boolean().optional().default(false),
});

export const recipeResourceGroupSchema = z.object({
  title: z.string().min(1, 'Název je povinný').describe('Group title'),
  parts: z.array(recipeResourceSchema).min(1),
});

export const recipeStepSchema = z.object({
  content: z.string(),
  duration: z.number(),
});

export const recipeStepGroupSchema = z.object({
  title: z.string().trim().describe('Group title'),
  parts: z.array(recipeStepSchema).min(1),
});

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

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeType = z.infer<typeof recipeTypeSchema>;
export type RecipeDifficulty = z.infer<typeof recipeDifficultySchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type RecipeResource = z.infer<typeof recipeResourceSchema>;
export type RecipeResourceMetric = z.infer<typeof recipeResourceMetricSchema>;
export type RecipeResourceGroupMetric = z.infer<
  typeof recipeResourceGroupSchema
>;
export type RecipeStepGroup = z.infer<typeof recipeStepGroupSchema>;
