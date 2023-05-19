export * from './trpc';
export * from './utils/server';
export * from './config';
export * from './logger';
export * from './services';
export * from './utils/isUserLoggedIn';
export * from './utils/getSessionFromCookies';
export * from './utils/deserializePocketToken';
export * from './utils/getLoggedInUser';
export type { PocketBase } from '@najit-najist/pb';

declare module 'iron-session' {
  interface IronSessionData {
    authContent?: {
      token: string;
      model: {
        username: string;
        verified: boolean;
        collectionId: string;
      };
    };
    previewAuthorized?: boolean;
  }
}
