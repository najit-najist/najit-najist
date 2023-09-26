import { z } from 'zod';
import { recipeResourceSchema } from './recipe-resources.schema';

export const recipeResourceGroupSchema = z.object({
  title: z.string().min(1, 'Název je povinný').describe('Group title'),
  parts: z.array(recipeResourceSchema).min(1),
});

export type RecipeResourceGroup = z.infer<typeof recipeResourceGroupSchema>;
