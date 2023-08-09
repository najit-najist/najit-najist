import {
  ErrorCodes,
  ErrorMessages,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { faker } from '@faker-js/faker';
import { formatErrorMessage, removeDiacritics } from '@utils';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { randomUUID } from 'crypto';
import {
  GetManyUsersOptions,
  RegisterUser,
  User,
  UserRoles,
  UserStates,
} from '@schemas';
import { logger } from '@logger';

type GetByType = keyof Pick<User, 'id' | 'email' | 'newsletterUuid'>;

type CreateUserOptions = Omit<
  User,
  | 'password'
  | 'newsletterUuid'
  | 'id'
  | 'username'
  | 'status'
  | 'role'
  | 'emailVisibility'
  | 'created'
  | 'verified'
  | 'address'
> &
  Partial<Pick<User, 'username' | 'status' | 'role' | 'emailVisibility'>> & {
    password?: string;
    address?: RegisterUser['address'];
  };

export class UserService {
  static async create(
    params: CreateUserOptions,
    requestVerification?: boolean
  ) {
    try {
      const password = params.password || faker.internet.password(15);
      let username = removeDiacritics(
        faker.internet.userName(params.firstName, params.lastName).toLowerCase()
      );

      let addressId: string | undefined;

      // TODO - create address for a user first

      if (params.address?.municipality) {
      }

      const user = await pocketbase
        .collection(PocketbaseCollections.USERS)
        .create<User>({
          username,
          lastLoggedIn: null,
          notes: null,
          emailVisibility: true,
          role: UserRoles.BASIC,
          // User first have to finish registration
          status: UserStates.ACTIVE,
          ...params,
          // Override some stuff
          password,
          passwordConfirm: password,
          newsletterUuid: randomUUID(),
          address: addressId,
        });

      logger.info(
        { email: user.email },
        `UserService: Create: created user under email:`
      );

      if (requestVerification) {
        await pocketbase
          .collection(PocketbaseCollections.USERS)
          .requestVerification(user.email);
      }

      return user;
    } catch (error) {
      // The "validation_invalid_email" error code does not entirely mean that its a duplicate, but we already check input in API
      if (error instanceof ClientResponseError) {
        const data = error.data.data;

        if (
          data.email?.code === PocketbaseErrorCodes.INVALID_EMAIL ||
          // TODO
          data.username?.code === 'validation_invalid_email'
        ) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_DUPLICATE,
            message: formatErrorMessage(ErrorMessages.USER_EXISTS, params),
            origin: 'UserService',
          });
        }
      }

      throw error;
    }
  }

  static async getBy(type: GetByType, value: any) {
    try {
      return pocketbase
        .collection(PocketbaseCollections.USERS)
        .getFirstListItem<User>(`${type}="${value}"`);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Uživatel pod daným polem '${type}' nebyl nalezen`,
          origin: 'UserService',
        });
      }

      throw error;
    }
  }

  static async getMany(options?: GetManyUsersOptions) {
    const { page = 1, perPage = 40 } = options ?? {};

    try {
      return pocketbase
        .collection(PocketbaseCollections.USERS)
        .getList<User>(page, perPage);
    } catch (error) {
      throw error;
    }
  }
}
