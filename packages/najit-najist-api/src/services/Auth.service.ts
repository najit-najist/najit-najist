import { pocketbase } from '@najit-najist/pb';
import { getSessionFromCookies } from '@utils';
import { IronSessionData } from 'iron-session';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

// TODO: refactor
export class AuthService {
  /**
   * Attaches current user into PocketBase
   */
  static async authPocketBase({
    cookies,
    authContent: prefetchedAuthContent,
  }: {
    cookies?: RequestCookies;
    authContent?: IronSessionData['authContent'];
  } = {}) {
    let authContent = prefetchedAuthContent;

    if (!authContent) {
      // TODO: get session from cookies outside
      authContent = await getSessionFromCookies({ cookies }).then(
        ({ authContent }) => authContent
      );
    }

    if (!authContent) {
      throw new Error('Cannot attach auth when user is not logged in');
    }
    // Clear previous calls
    pocketbase.authStore.clear();

    pocketbase.authStore.save(authContent.token, authContent.model);

    return {
      token: authContent.token,
    };
  }

  static clearAuthPocketBase() {
    pocketbase.authStore.clear();
  }

  static isPocketBaseAuthorized() {
    return pocketbase.authStore.isValid;
  }
}
