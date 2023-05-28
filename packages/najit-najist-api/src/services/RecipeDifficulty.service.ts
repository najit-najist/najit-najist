import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
import { GetManyUsersOptions, RecipeDifficulty } from '@schemas';

type GetByType = keyof Pick<RecipeDifficulty, 'id'>;

export class RecipeDifficultyService {
  static async getBy(type: GetByType, value: any): Promise<RecipeDifficulty> {
    try {
      return pocketbase
        .collection(PocketbaseCollections.RECIPE_DIFFICULTY)
        .getFirstListItem<RecipeDifficulty>(`${type}="${value}"`);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Náročnost receptu pod daným polem '${type}' nebyl nalezen`,
          origin: 'RecipesService',
        });
      }

      throw error;
    }
  }

  static async getMany(
    options?: GetManyUsersOptions
  ): Promise<ListResult<RecipeDifficulty>> {
    const { page = 1, perPage = 40 } = options ?? {};

    try {
      return pocketbase
        .collection(PocketbaseCollections.RECIPE_DIFFICULTY)
        .getList<RecipeDifficulty>(page, perPage);
    } catch (error) {
      throw error;
    }
  }
}
