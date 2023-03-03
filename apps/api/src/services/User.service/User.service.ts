import { ErrorCodes, User, UserRoles, UserStates } from '@custom-types';
import { ApplicationError } from '@errors';
import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { PocketBase } from '@najit-najist/pb';

type GetByType = keyof Pick<User, 'id' | 'email' | 'newsletterUuid'>;

export class UserService {
  #logger: FastifyInstance['log'];
  #pb: PocketBase;

  constructor(server: FastifyInstance) {
    this.#logger = server.log;
    this.#pb = server.pb;
  }

  async create(
    params: Omit<
      User,
      'password' | 'newsletterUuid' | 'id' | 'createdAt' | 'status' | 'role'
    > &
      Partial<Pick<User, 'password' | 'status' | 'role'>>
  ) {
    try {
      const password = params.password || faker.internet.password(12);
      const user = await this.#pb.collection('users').create<User>({
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        username: params.email.split('@')[0],
        telephoneNumber: params.telephoneNumber ?? null,
        status: UserStates.SUBSCRIBED,
        role: params.role ?? UserRoles.NORMAL,
        newsletter: true,
        newsletterUuid: crypto.randomUUID(),
        lastLoggedIn: null,
        password,
        passwordConfirm: password,
        notes: null,
      });

      this.#logger.info(
        `UserService: Create: created user under email: ${user.email}`
      );

      return user;
    } catch (error) {
      // TODO: handle duplicates differently

      throw error;
    }
  }

  async getBy(type: GetByType, value: any): Promise<User> {
    //TODO: Implement this
    // try {
    //   return prisma.user.findFirstOrThrow({
    //     where: {
    //       [type]: value,
    //     },
    //   });
    // } catch (e) {
    //   // if (e instanceof Prisma.PrismaClientValidationError) {
    //   //   throw new ApplicationError({
    //   //     code: ErrorCodes.ENTITY_MISSING,
    //   //     message: `Uživatel pod daným ${type} nebyl nalezen`,
    //   //     origin: 'UserService',
    //   //   });
    //   // }
    //   throw e;
    // }
  }
}
