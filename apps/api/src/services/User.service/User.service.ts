import { ErrorCodes, ErrorMessages } from '@custom-types';
import { ApplicationError } from '@errors';
import { MailService } from '@services/Mail.service';
import { TokenService } from '@services/Token.service';
import { Prisma, User } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { prisma } from '@constants';
import { formatErrorMessage } from '@utils';

type GetByType = keyof Pick<User, 'id' | 'email' | 'newsletterUuid'>;

export class UserService {
  private logger: FastifyInstance['log'];
  private mailService: MailService;
  private tokenService: TokenService;

  constructor(server: FastifyInstance) {
    this.logger = server.log;
    if (!server.services.mail) {
      throw new ApplicationError({
        code: ErrorCodes.GENERIC,
        message: 'Email service missing',
        origin: 'UserService.constructor',
      });
    }
    this.mailService = server.services.mail;

    if (!server.services.token) {
      throw new ApplicationError({
        code: ErrorCodes.GENERIC,
        message: 'Email service missing',
        origin: 'UserService.constructor',
      });
    }

    this.tokenService = server.services.token;
  }

  async create(params: User) {
    try {
      const user = await prisma.user.create({
        data: {
          ...params,
          password: params.password || faker.internet.password(15),
          newsletterUuid: randomUUID(),
        },
      });

      this.logger.info(
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
