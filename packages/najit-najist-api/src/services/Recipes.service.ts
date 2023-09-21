import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
import {
  CreateRecipeInput,
  GetManyRecipes,
  Recipe,
  RecipeDifficulty,
  RecipeType,
  UpdateRecipeInput,
} from '@schemas';
import { slugifyString } from '@utils';
import { objectToFormData } from '@utils/internal';
import { RecipeDifficultyService } from './RecipeDifficulty.service';
import { RecipeResourceMetricService } from './RecipeResourceMetric.service';
import { RecipeTypeService } from './RecipeType.service';
import { logger } from '@logger';

type GetByType = keyof Pick<Recipe, 'id' | 'slug'>;

const BASE_EXPAND = 'difficulty,type';

type RecipeWithExpand = Recipe & {
  type: string;
  difficulty: string;
  expand: {
    type: RecipeType;
    difficulty: RecipeDifficulty;
  };
};

export class RecipesService {
  static resourceMetrics: RecipeResourceMetricService =
    new RecipeResourceMetricService();

  static types: RecipeTypeService = new RecipeTypeService();
  static difficulties = RecipeDifficultyService;

  private static mapExpandToResponse(
    recipeWithExpand: RecipeWithExpand
  ): Recipe {
    const {
      expand: { type, difficulty },
      resources,
      steps,
      ...rest
    } = recipeWithExpand;

    return {
      ...rest,
      resources:
        typeof resources === 'string'
          ? JSON.parse(resources as unknown as string)
          : resources,
      steps:
        typeof steps === 'string'
          ? JSON.parse(steps as unknown as string)
          : steps,
      type,
      difficulty,
    };
  }

  static async update(
    id: string,
    { resources, steps, title, ...input }: UpdateRecipeInput
  ): Promise<Recipe> {
    try {
      return this.mapExpandToResponse(
        await pocketbase.collection(PocketbaseCollections.RECIPES).update(
          id,
          await objectToFormData({
            ...input,
            ...(title ? { slug: slugifyString(title), title } : null),
            ...(resources ? { resources: JSON.stringify(resources) } : null),
            ...(steps ? { steps: JSON.stringify(steps) } : null),
          }),
          { expand: BASE_EXPAND }
        )
      );
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Recept pod daným id '${id}' nebyl nalezen`,
          origin: RecipesService.name,
        });
      }

      throw error;
    }
  }

  static async create({
    resources,
    steps,
    title,
    ...input
  }: CreateRecipeInput): Promise<Recipe> {
    try {
      return this.mapExpandToResponse(
        await pocketbase.collection(PocketbaseCollections.RECIPES).create(
          await objectToFormData({
            ...input,
            ...(title ? { slug: slugifyString(title), title } : null),
            ...(resources
              ? { resources: JSON.stringify(resources ?? []) }
              : null),
            ...(steps ? { steps: JSON.stringify(steps ?? []) } : null),
          }),
          { expand: BASE_EXPAND }
        )
      );
    } catch (error) {
      logger.error(error, 'Could not create recipe');

      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Recept nemůže být vytvořen`,
          origin: RecipesService.name,
        });
      }

      throw error;
    }
  }

  static async getBy(type: GetByType, value: any): Promise<Recipe> {
    try {
      return this.mapExpandToResponse(
        await pocketbase
          .collection(PocketbaseCollections.RECIPES)
          .getFirstListItem<RecipeWithExpand>(
            `${type}="${decodeURIComponent(value)}"`,
            {
              expand: BASE_EXPAND,
            }
          )
      );
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Recept pod daným polem '${type}' nebyl nalezen`,
          origin: 'RecipesService',
        });
      }

      throw error;
    }
  }

  static async getMany(options?: GetManyRecipes): Promise<ListResult<Recipe>> {
    const {
      page = 1,
      perPage = 40,
      difficultySlug,
      search,
      typeSlug,
    } = options ?? {};

    try {
      const filter = [
        difficultySlug ? `difficulty.slug = '${difficultySlug}'` : undefined,
        typeSlug ? `type.slug = '${typeSlug}'` : undefined,
        search
          ? `(title ~ '${search}' || slug ~ '${search}' || steps ~ '${search}')`
          : undefined,
      ]
        .filter(Boolean)
        .join(' && ');

      const result = await pocketbase
        .collection(PocketbaseCollections.RECIPES)
        .getList<RecipeWithExpand>(page, perPage, {
          expand: BASE_EXPAND,
          filter,
        });

      return { ...result, items: result.items.map(this.mapExpandToResponse) };
    } catch (error) {
      throw error;
    }
  }
}
