import { AppRouter } from '@custom-types';
import { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';

export const APP_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://najitnajist.cz'
    : 'http://localhost:3000';

export const APP_ORIGIN = process.env.APP_ORIGIN ?? APP_BASE_URL;

export const ADMIN_EMAIL = 'info@najitnajist.cz';
export const ORDER_NOTIFICATION_EMAILS = [
  ADMIN_EMAIL,
  'prodejnahk@najitnajist.cz',
];

export const DEFAULT_DATE_FORMAT = 'DD. MM. YYYY v HH:mm' as const;
export const DATETIME_LOCAL_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm' as const;
export const DATABASE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
export const ACCEPT_FILES_IMAGE = '.png,.img,.jpg,.gif,.svg,.jpeg';

export const AUTHORIZATION_HEADER = 'Authorization';
export const serverPort = process.env.NODE_ENV === 'development' ? 3000 : 4000;
export const APP_NAME = 'najit-najist';
export const SESSION_NAME = `${APP_NAME}-session`;
export const SESSION_LENGTH_IN_SECONDS = 15 * 24 * 3600; // fourteen days

export const sessionSecret =
  process.env.SESSION_SECRET_VALUE ?? 'supersecretconstantthatyoucannotbreak';

export const jwtSecret =
  process.env.JWT_SECRET_VALUE ?? 'supersecretconstantthatyoucannotbreak';

export const LOGIN_THEN_REDIRECT_TO_PARAMETER = 'loginBeforeContinue';
export const LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER = 'continue';
export const X_REQUEST_PATH_HEADER_NAME = 'x-invoke-path';
export const loginPageCallbacks = {
  previewRegistrationFinished: 'registrationPreviewCallback',
};
export const GA_KEY = process.env.NEXT_PUBLIC_GA_KEY;

/**
 * Custom trpc link that logs out user in app when not logged in
 */
export const customTrpcLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          if (err.message === 'UNAUTHORIZED') {
            console.log('User is not authenticated - path: ' + err.data?.path);
          } else {
            console.error(err);
          }

          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });

      return unsubscribe;
    });
  };
};
