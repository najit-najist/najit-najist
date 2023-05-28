import { User } from '@custom-types';
import { logger } from '@logger';
import { pocketbase, Record } from '@najit-najist/pb';
import { getSessionFromCookies } from '@utils';
import { PasswordService } from './Password.service';
import { UserService } from './User.service';

export class AuthService {
  static async validateUser(
    email: string,
    pass: string
  ): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await UserService.getBy('email', email);

      if (await PasswordService.validate(user.password!, pass)) {
        // remove password
        const { password, ...result } = user;

        return result;
      }
    } catch (e) {
      logger.error(e, `validateUser: validation failed because:`);
    }

    return null;
  }

  /**
   * Attaches current user into PocketBase
   */
  static async authPocketBase() {
    const { authContent } = await getSessionFromCookies();

    if (!authContent) {
      throw new Error('Cannot attach auth when user is not logged in');
    }

    pocketbase.authStore.save(authContent.token, new Record(authContent.model));

    return {
      token: authContent.token,
    };
  }

  static clearAuthPocketBase() {
    pocketbase.authStore.clear();
  }
}
