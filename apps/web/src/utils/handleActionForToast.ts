import { isNextRedirect } from '@server/utils/isNextRedirect';

export const handlePromiseForToast = (prom: Promise<any>) =>
  prom.catch((error) => {
    if (isNextRedirect(error)) {
      return;
    }

    throw error;
  });
