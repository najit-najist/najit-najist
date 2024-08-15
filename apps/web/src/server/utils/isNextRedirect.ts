export const isNextRedirect = (error: any) =>
  error.message !== 'NEXT_NOT_FOUND';
