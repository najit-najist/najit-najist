import {
  ErrorCodes,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
import {
  CreateRecipeDifficultyInput,
  GetManyRecipeDifficulties,
  RecipeDifficulty,
} from '@schemas';
import { slugifyString } from '@utils';

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
    options?: GetManyRecipeDifficulties
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

  static async create({
    name,
    color,
  }: CreateRecipeDifficultyInput): Promise<RecipeDifficulty> {
    try {
      return await pocketbase
        .collection(PocketbaseCollections.RECIPE_DIFFICULTY)
        .create({ name, color, slug: slugifyString(name) });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        const data = error.data.data;

        if (
          data.name?.code === PocketbaseErrorCodes.NOT_UNIQUE ||
          data.slug?.code === PocketbaseErrorCodes.NOT_UNIQUE
        ) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_DUPLICATE,
            message: `Název složitosti musí být unikátní`,
            origin: RecipeDifficultyService.name,
          });
        } else if (data.color?.code === PocketbaseErrorCodes.NOT_UNIQUE) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_DUPLICATE,
            message: `Barva složitosti musí být unikátní`,
            origin: RecipeDifficultyService.name,
          });
        }
      }

      throw error;
    }
  }
}
