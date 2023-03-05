import {
  ErrorCodes,
  ErrorMessages,
  PocketbaseCollections,
  PocketbaseErrorCodes,
  User,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { formatErrorMessage, removeDiacritics } from '@utils';
import { PasswordService } from '@services/Password.service';
import { ClientResponseError } from 'pocketbase';

type GetByType = keyof Pick<User, 'id' | 'email' | 'newsletterUuid'>;

export class UserService {
  #logger: FastifyInstance['log'];
  #pocketbase: FastifyInstance['pb'];

  constructor(server: FastifyInstance) {
    this.#logger = server.log;

    if (!server.services.token) {
      throw new ApplicationError({
        code: ErrorCodes.GENERIC,
        message: 'Token service missing',
        origin: 'UserService.constructor',
      });
    }

    this.#pocketbase = server.pb;
  }

  async create(
    params: Omit<
      User,
      'password' | 'newsletterUuid' | 'id' | 'createdAt' | 'username'
    > &
      Partial<Pick<User, 'password' | 'username'>>,
    requestVerification?: boolean
  ) {
    try {
      const password = await PasswordService.hash(
        params.password || faker.internet.password(15)
      );
      let username = removeDiacritics(
        faker.internet.userName(params.firstName, params.lastName).toLowerCase()
      );

      const user = await this.#pocketbase
        .collection(PocketbaseCollections.USERS)
        .create<User>({
          username,
          lastLoggedIn: null,
          notes: null,
          emailVisibility: true,
          ...params,
          // Override some stuff
          password,
          passwordConfirm: password,
          newsletterUuid: randomUUID(),
        });

      this.#logger.info(
        `UserService: Create: created user under email: ${params.email}`
      );

      if (requestVerification) {
        await this.#pocketbase
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

  async getBy(type: GetByType, value: any) {
    try {
      return this.#pocketbase
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
}
