import { createRecipeAction } from './actions/createRecipeAction';

export type ViewType = 'create' | 'edit' | 'view';
export type RecipeFormData = Parameters<typeof createRecipeAction>[0];
