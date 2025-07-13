import { REDIRECT_ERROR_CODE } from 'next/dist/client/components/redirect-error';

export const isNextRedirect = (error: any) =>
  error.message === REDIRECT_ERROR_CODE;
