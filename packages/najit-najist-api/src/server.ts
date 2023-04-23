export * from './trpc';
export * from './utils/server';
export * from './config';
export * from './logger';
export * from './services/Token.service';
export type { PocketBase } from '@najit-najist/pb';

declare module 'iron-session' {
  interface IronSessionData {
    userToken?: string;
    previewAuthorized?: boolean;
  }
}
