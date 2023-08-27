import {
  ErrorCodes,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
import {
  CreateRecipeResourceMetricInput,
  GetManyRecipeResourceMetricInput,
  RecipeResourceMetric,
} from '@schemas';

export type AvailableTemplates = 'contact-us/admin' | 'contact-us/user';

export class RecipeResourceMetricService {
  async getMany(
    options?: GetManyRecipeResourceMetricInput
  ): Promise<ListResult<RecipeResourceMetric>> {
    const { page = 1, perPage = 40 } = options ?? {};

    try {
      const result = await pocketbase
        .collection(PocketbaseCollections.RECIPE_RESOURCE_METRIC)
        .getList<RecipeResourceMetric>(page, perPage);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async create({
    name,
  }: CreateRecipeResourceMetricInput): Promise<RecipeResourceMetric> {
    try {
      return await pocketbase
        .collection(PocketbaseCollections.RECIPE_RESOURCE_METRIC)
        .create({ name });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        const data = error.data.data;

        if (data.name?.code === PocketbaseErrorCodes.NOT_UNIQUE) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_DUPLICATE,
            message: `Název metriky musí být unikátní`,
            origin: RecipeResourceMetricService.name,
          });
        }
      }

      throw error;
    }
  }
}
