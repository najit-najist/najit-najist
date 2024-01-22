import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export * from './trpc';
export * from './utils/server';
export * from './config';
export * from './logger';
export * from './services';
export * from './utils/isUserLoggedIn';
export * from './utils/getSessionFromCookies';
export * from './utils/deserializePocketToken';
export * from './utils/server/getLoggedInUser';
export * from './utils/pocketbase/loginWithAccount';
export * from './utils/logoutUser';
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
