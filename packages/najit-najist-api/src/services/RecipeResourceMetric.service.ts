import { PocketbaseCollections } from '@custom-types';
import { ListResult, pocketbase } from '@najit-najist/pb';
import {
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
}
