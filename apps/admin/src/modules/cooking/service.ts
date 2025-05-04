import { MedusaService } from '@medusajs/framework/utils';

import { Recipe } from './models/recipe';
import { RecipeCategory } from './models/recipe-category';
import { RecipeDifficulty } from './models/recipe-difficulty';
import { RecipeResource } from './models/recipe-resource';
import { RecipeStep } from './models/recipe-step';
import { RecipeStepPart } from './models/recipe-step-part';

export class CookingModuleService extends MedusaService({
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
  RecipeResource,
  RecipeStep,
  RecipeStepPart,
}) {}
