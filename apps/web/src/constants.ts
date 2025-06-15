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

export const COMPANY_INFO = {
  name: 'Sídlo v Šanově',
  openingHours: [
    {
      from: '10:00',
      to: '18:00',
    },
    {
      from: '10:00',
      to: '18:00',
    },
    {
      from: '10:00',
      to: '18:00',
    },
    {
      from: '10:00',
      to: '18:00',
    },
    {
      from: '10:00',
      to: '18:00',
    },
  ],
  address: {
    city: 'Šanov',
    postCode: '671 68',
    street: 'Nová 428',
  },
  telephoneNumbers: [
    {
      code: '420',
      telephone: '792651408',
    },
  ] as { telephone: string; code: string }[],
  emailAddress: 'info@najitnajist.cz',
  map: {
    location:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2464.8326713378074!2d16.382580535493283!3d48.80223028803676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d4a5508559e9d%3A0x5cb14cc51fd1a37!2zTm92w6EgNDI4LCA2NzEgNjggxaBhbm92LUhyYWLEm3RpY2U!5e0!3m2!1sen!2scz!4v1750015642146!5m2!1sen!2scz',
  },
};
