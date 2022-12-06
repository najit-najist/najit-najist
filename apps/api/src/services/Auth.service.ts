import { ErrorCodes } from '@custom-types';
import { ApplicationError } from '@errors';
import type { User } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { PasswordService } from './Password.service';
import { UserService } from './User.service/User.service';

export class AuthService {
  private userService: UserService;
  private server: FastifyInstance;

  constructor(server: FastifyInstance) {
    if (!server.services.user) {
      throw new ApplicationError({
        code: ErrorCodes.GENERIC,
        message: 'User service missing',
        origin: 'UserService.constructor',
      });
    }
    this.userService = server.services.user;
    this.server = server;
  }

  async validateUser(
    email: string,
    pass: string
  ): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.userService.getBy('email', email);

      if (await PasswordService.validate(user.password!, pass)) {
        // remove password
        const { password, ...result } = user;

        return result;
      }
    } catch (e) {
      this.server.log.error(
        {},
        `validateUser: validation failed because: ${(e as Error).message}`
      );
    }

    return null;
  }
}
