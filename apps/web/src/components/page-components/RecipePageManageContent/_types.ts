import type { recipeCreateInputSchema } from '@server/schemas/recipeCreateInputSchema';
import { z } from 'zod';

export type ViewType = 'create' | 'edit' | 'view';
export type RecipeFormData = z.input<typeof recipeCreateInputSchema>;
