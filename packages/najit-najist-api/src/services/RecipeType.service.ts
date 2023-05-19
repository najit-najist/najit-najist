import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
import { GetManyUsersOptions, RecipeType } from '@schemas';

type GetByType = keyof Pick<RecipeType, 'id'>;

export class RecipeTypeService {
  async getBy(type: GetByType, value: any): Promise<RecipeType> {
    try {
      return pocketbase
        .collection(PocketbaseCollections.RECIPE_TYPES)
        .getFirstListItem<RecipeType>(`${type}="${value}"`);
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

  async getMany(
    options?: GetManyUsersOptions
  ): Promise<ListResult<RecipeType>> {
    const { page = 1, perPage = 40 } = options ?? {};

    try {
      return pocketbase
        .collection(PocketbaseCollections.RECIPE_TYPES)
        .getList<RecipeType>(page, perPage);
    } catch (error) {
      throw error;
    }
  }
}
