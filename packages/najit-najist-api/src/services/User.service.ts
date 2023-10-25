import {
  ErrorCodes,
  ErrorMessages,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { faker } from '@faker-js/faker';
import { expandPocketFields, formatErrorMessage } from '@utils';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
import { randomUUID } from 'crypto';
import {
  Address,
  GetManyUsersOptions,
  RegisterUser,
  UpdateProfile,
  User,
  UserRoles,
  UserStates,
} from '@schemas';
import { logger } from '@logger';
import { objectToFormData } from '@utils/internal';

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

type UserWithExpand = User & { expand: { address: Address } };
type AddressWithExpand = Address & { expand: { address: Address } };

const expand = `${PocketbaseCollections.USER_ADDRESSES}(owner).municipality`;

export type UserServiceUpdateOptions = UpdateProfile & {
  password?: string;
  verified?: boolean;
  status?: UserStates | string;
};

export class UserService {
  static async create(
    params: CreateUserOptions,
    requestVerification?: boolean
  ): Promise<User> {
    try {
      const password = params.password || faker.internet.password(15);
      const { totalItems: usersCount } = await pocketbase
        .collection(PocketbaseCollections.USERS)
        .getList(1, 1);

      const username = `uzivatel_${usersCount + 1}`;

      logger.info(
        {
          username,
          lastLoggedIn: null,
          notes: null,
          emailVisibility: true,
          role: UserRoles.BASIC,
          // User first have to finish registration
          status: UserStates.ACTIVE,
          ...params,
          // Override some stuff
          password: undefined,
          passwordConfirm: undefined,
        },
        'Registering user - before register'
      );

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
        });

      let address: Address | undefined;
      if (Object.keys(params.address ?? {}).length > 0) {
        const createAddressPayload = {
          ...params.address,
          owner: user.id,
          municipality: params.address?.municipality.id,
        };

        address = await pocketbase
          .collection(PocketbaseCollections.USER_ADDRESSES)
          .create<AddressWithExpand>(createAddressPayload, {
            expand: 'municipality',
          })
          .then(expandPocketFields<Address>);
      }

      logger.info(
        { email: user.email },
        `UserService: Create: created user under email:`
      );

      if (requestVerification) {
        await pocketbase
          .collection(PocketbaseCollections.USERS)
          .requestVerification(user.email);
      }

      return expandPocketFields<User>({
        ...user,
        expand: { address },
      });
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

  static async getBy(type: GetByType, value: any): Promise<User> {
    try {
      return pocketbase
        .collection(PocketbaseCollections.USERS)
        .getFirstListItem<UserWithExpand>(`${type}="${value}"`, { expand })
        .then(expandPocketFields<User>);
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

  static async getMany(
    options?: GetManyUsersOptions
  ): Promise<ListResult<User>> {
    const { page = 1, perPage = 40 } = options ?? {};

    try {
      return pocketbase
        .collection(PocketbaseCollections.USERS)
        .getList<UserWithExpand>(page, perPage, { expand })
        .then((values) => {
          (values.items as any) = values.items.map(expandPocketFields<User>);

          return values as ListResult<User>;
        });
    } catch (error) {
      throw error;
    }
  }

  static async update(
    where: { id: string },
    payload: UserServiceUpdateOptions
  ) {
    const {
      address = {} as NonNullable<(typeof payload)['address']>,
      ...rest
    } = {
      ...payload,
    };
    const addressAsKeys = Object.keys(address);

    if (addressAsKeys.length > 0) {
      const morphedAddress = {
        ...address,
        ...(address.municipality
          ? { municipality: address.municipality.id }
          : {}),
      };

      if ('id' in address) {
        console.log(`User has address already`);
        await pocketbase
          .collection(PocketbaseCollections.USER_ADDRESSES)
          .update(address.id, morphedAddress);
      } else {
        // TODO - ensuring that address for one user is created once is kind of handled
        // in schemas, but it would be better to check it here too. Due to nature of pocketbase we kind of
        // Need to do two round trips to database
        console.log(`Creating new address for a user`);
        await pocketbase
          .collection(PocketbaseCollections.USER_ADDRESSES)
          .create({ ...morphedAddress, owner: where.id });
      }
    }

    if (rest.password) {
      (rest as any).passwordConfirm = rest.password;
    }

    return pocketbase
      .collection(PocketbaseCollections.USERS)
      .update<UserWithExpand>(where.id, await objectToFormData(rest), {
        expand,
      })
      .then(expandPocketFields<User>);
  }
}
