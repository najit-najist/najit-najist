import {
  ErrorCodes,
  PocketbaseCollections,
  UserLikedPost,
  UserLikedRecipe,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { CreateUserLikedRecipesInput } from '@schemas';

export class UserLikedRecipesService {
  static async create(input: CreateUserLikedRecipesInput) {
    return pocketbase
      .collection(PocketbaseCollections.USER_LIKED_RECIPES)
      .create<UserLikedRecipe>(input);
  }

  static async getOne(input: Pick<UserLikedRecipe, 'likedItem'>) {
    try {
      return pocketbase
        .collection(PocketbaseCollections.USER_LIKED_RECIPES)
        .getFirstListItem<UserLikedRecipe>(`likedItem="${input.likedItem}"`);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Tento repect není v oblíbených receptech`,
          origin: 'UserService',
        });
      }

      throw error;
    }
  }

  static async delete(id: UserLikedPost['id']) {
    return pocketbase
      .collection(PocketbaseCollections.USER_LIKED_RECIPES)
      .delete(id);
  }
}
