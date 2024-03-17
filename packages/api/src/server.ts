export * from './comgate';

export * from './trpc';
export * from './utils/server';
export * from './config';
export * from './logger';
export * from './services';
export * from './utils/getSessionFromCookies';
export * from './utils/server/getLoggedInUser';
export * from './utils/logoutUser';
export type { PocketBase } from '@najit-najist/pb';

declare module 'iron-session' {
  interface IronSessionData {
    authContent?: {
      userId: number;
    };
    previewAuthorized?: boolean;
  }
}
