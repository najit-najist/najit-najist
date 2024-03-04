import { recipeCreateInputSchema } from './recipeCreateInputSchema';

export const recipeUpdateInputSchema = recipeCreateInputSchema.partial();
