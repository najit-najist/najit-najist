import { ErrorCodes, ErrorMessages } from '@custom-types';
import { ApplicationError } from '@errors';
import { Prisma, User } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { prisma } from '@constants';
import { formatErrorMessage } from '@utils';
import { PasswordService } from '@services/Password.service';

type GetByType = keyof Pick<User, 'id' | 'email' | 'newsletterUuid'>;

export class UserService {
  #logger: FastifyInstance['log'];

  constructor(server: FastifyInstance) {
    this.#logger = server.log;
    if (!server.services.mail) {
      throw new ApplicationError({
        code: ErrorCodes.GENERIC,
        message: 'Email service missing',
        origin: 'UserService.constructor',
      });
    }
  }

  async create(
    params: Omit<User, 'password' | 'newsletterUuid' | 'id' | 'createdAt'> &
      Partial<Pick<User, 'password'>>
  ) {
    try {
      const user = await prisma.user.create({
        data: {
          ...params,
          password: await PasswordService.hash(
            params.password || faker.internet.password(15)
          ),
          newsletterUuid: randomUUID(),
        },
      });

      this.#logger.info(
        `UserService: Create: created user under email: ${params.email}`
      );

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_DUPLICATE,
          message: formatErrorMessage(ErrorMessages.USER_EXISTS, params),
          origin: 'UserService',
        });
      } else {
        throw error;
      }
    }
  }

  async getBy(type: GetByType, value: any) {
    try {
      return prisma.user.findFirstOrThrow({
        where: {
          [type]: value,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Uživatel pod daným ${type} nebyl nalezen`,
          origin: 'UserService',
        });
      }

      throw e;
    }
  }
}
