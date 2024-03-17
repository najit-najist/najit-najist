import { recipeStepItemCreateInputSchema } from './recipeStepItemCreateInputSchema';

export const recipeStepItemUpdateInputSchema =
  recipeStepItemCreateInputSchema.partial();
