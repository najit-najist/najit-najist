import { SESSION_NAME } from '@constants';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export const logoutUser = (headers: Headers) => {
  const cookies = new ResponseCookies(headers);

  cookies.delete(SESSION_NAME);

  // headers.append('set-cookie', cookies.toString());

  return headers;
};
