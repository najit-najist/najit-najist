import { ErrorCodes, User } from '@custom-types';
import { ApplicationError } from '@errors';
import { logger } from '@logger';
import { PasswordService } from './Password.service';
import { UserService } from './User.service/User.service';

export class AuthService {
  #userService: UserService;

  constructor({ userService }: { userService: UserService }) {
    if (!userService) {
      throw new ApplicationError({
        code: ErrorCodes.GENERIC,
        message: 'User service missing',
        origin: 'UserService.constructor',
      });
    }
    this.#userService = userService;
  }

  async validateUser(
    email: string,
    pass: string
  ): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.#userService.getBy('email', email);

      if (await PasswordService.validate(user.password!, pass)) {
        // remove password
        const { password, ...result } = user;

        return result;
      }
    } catch (e) {
      logger.error(
        `validateUser: validation failed because: ${(e as Error).message}`
      );
    }

    return null;
  }
}
