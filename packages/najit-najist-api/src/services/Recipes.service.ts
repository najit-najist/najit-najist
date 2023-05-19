import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
import {
  CreateRecipeInput,
  GetManyUsersOptions,
  Recipe,
  RecipeDifficulty,
  RecipeType,
  UpdateRecipeInput,
} from '@schemas';
import { slugify } from '@utils';
import { RecipeResourceMetricService } from './RecipeResourceMetric.service';

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

  private mapExpandToResponse(recipeWithExpand: RecipeWithExpand): Recipe {
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

  async update(id: string, input: UpdateRecipeInput): Promise<Recipe> {
    try {
      return this.mapExpandToResponse(
        await pocketbase
          .collection(PocketbaseCollections.RECIPES)
          .update(
            id,
            {
              ...input,
              ...(input.title ? { slug: slugify(input.title) } : null),
            },
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

  async create(input: CreateRecipeInput): Promise<Recipe> {
    try {
      return this.mapExpandToResponse(
        await pocketbase
          .collection(PocketbaseCollections.RECIPES)
          .create(
            { ...input, slug: slugify(input.title) },
            { expand: BASE_EXPAND }
          )
      );
    } catch (error) {
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

  async getBy(type: GetByType, value: any): Promise<Recipe> {
    try {
      return this.mapExpandToResponse(
        await pocketbase
          .collection(PocketbaseCollections.RECIPES)
          .getFirstListItem<RecipeWithExpand>(`${type}="${value}"`, {
            expand: BASE_EXPAND,
          })
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

  async getMany(options?: GetManyUsersOptions): Promise<ListResult<Recipe>> {
    const { page = 1, perPage = 40 } = options ?? {};

    try {
      const result = await pocketbase
        .collection(PocketbaseCollections.RECIPES)
        .getList<RecipeWithExpand>(page, perPage, { expand: BASE_EXPAND });

      return { ...result, items: result.items.map(this.mapExpandToResponse) };
    } catch (error) {
      throw error;
    }
  }
}
