import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import {
  PreviewSubscribersTokens,
  VerifyRegistrationFromPreviewInput,
} from '@schemas';
import { expandPocketFields } from '@utils';
import { config } from '@config';
import { AuthService } from './Auth.service';
import { UserService } from './User.service';

export class PreviewSubscribersService {
  static async getUserByToken(token: string, auth = true) {
    try {
      if (auth) {
        await config.pb.loginWithAccount('contactForm');
      }
      const result = await pocketbase
        .collection(PocketbaseCollections.PREVIEW_SUBSCRIBERS_TOKENS)
        .getFirstListItem(`token="${token}"`, {
          expand: 'for',
        })
        .then(expandPocketFields<PreviewSubscribersTokens>);

      if (auth) {
        AuthService.clearAuthPocketBase();
      }

      return result;
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Uživatel nebyl nalezen`,
          origin: this.name,
        });
      }

      throw error;
    }
  }

  static async finishRegistration(input: VerifyRegistrationFromPreviewInput) {
    const { address, password, token } = input;

    await config.pb.loginWithAccount('contactForm');
    const { for: user } = await this.getUserByToken(token, false);

    if (user.verified) {
      throw new Error('Uživatel je již aktivován');
    }

    await UserService.update(
      { id: user.id },
      {
        address,
        password,
        verified: true,
      }
    );

    AuthService.clearAuthPocketBase();
  }
}
