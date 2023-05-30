import { AppRouter } from '@najit-najist/api';
import { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';

export const ADMIN_EMAIL = 'info@najitnajist.cz';
export const DEFAULT_DATE_FORMAT = 'DD. MM. YYYY @ HH:ss' as const;
export const DATETIME_LOCAL_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm' as const;
export const DATABASE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
export const ACCEPT_FILES_IMAGE = '.png,.img,.jpg,.gif,.svg,.jpeg';

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
