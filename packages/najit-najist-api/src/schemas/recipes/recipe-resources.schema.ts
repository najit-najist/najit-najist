import { z } from 'zod';

export const recipeResourceSchema = z.object({
  count: z.number(),
  metric: z.string().trim(),
  title: z.string().trim().min(1, 'Název je povinný'),
  description: z.string().optional(),
  isOptional: z.boolean().optional().default(false),
});

export type RecipeResource = z.infer<typeof recipeResourceSchema>;
