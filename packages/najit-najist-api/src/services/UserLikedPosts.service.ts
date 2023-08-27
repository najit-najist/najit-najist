import {
  ErrorCodes,
  PocketbaseCollections,
  UserLikedPost,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { CreateUserLikedPostsInput } from '@schemas';

export class UserLikedPostsService {
  static async create(input: CreateUserLikedPostsInput) {
    return pocketbase
      .collection(PocketbaseCollections.USER_LIKED_POSTS)
      .create<UserLikedPost>(input);
  }

  static async getOne(input: Pick<UserLikedPost, 'likedItem'>) {
    try {
      return pocketbase
        .collection(PocketbaseCollections.USER_LIKED_RECIPES)
        .getFirstListItem<UserLikedPost>(`likedItem="${input.likedItem}"`);
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
      .collection(PocketbaseCollections.USER_LIKED_POSTS)
      .delete(id);
  }
}
