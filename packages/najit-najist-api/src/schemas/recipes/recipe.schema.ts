import { entrySchema } from '../entry.schema';
import { z } from 'zod';

export const recipeTypeSchema = entrySchema.extend({
  title: z.string(),
  slug: z.string(),
});

export const recipeResourceMetricSchema = entrySchema.extend({
  name: z.string(),
});

export const recipeDifficultySchema = entrySchema.extend({
  name: z.string(),
  color: z.string(),
  slug: z.string(),
});

export const recipeResourceSchema = z.object({
  count: z.number(),
  metric: z.string(),
  title: z.string(),
  description: z.string().optional(),
  isOptional: z.boolean().optional().default(false),
});

export const recipeResourceGroupSchema = z.object({
  title: z.string().describe('Group title'),
  parts: z.array(recipeResourceSchema).min(1),
});

export const recipeStepSchema = z.object({
  content: z.string(),
  duration: z.number(),
});

export const recipeStepGroupSchema = z.object({
  title: z.string().describe('Group title'),
  parts: z.array(recipeStepSchema).min(1),
});

export const recipeSchema = entrySchema.extend({
  title: z.string(),
  slug: z.string(),
  images: z.array(z.string()),
  description: z.string().describe('A html description'),
  type: recipeTypeSchema,
  numberOfPortions: z.number().optional(),
  resources: z.array(recipeResourceSchema),
  steps: z.array(recipeStepGroupSchema),
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
