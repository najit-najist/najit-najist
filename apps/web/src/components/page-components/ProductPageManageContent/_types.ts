import { Recipe } from '@najit-najist/api';

export type ViewType = 'create' | 'edit' | 'view';
export type RecipeFormData = Omit<Recipe, 'difficulty' | 'type'> & {
  difficulty: string;
  type: string;
};
