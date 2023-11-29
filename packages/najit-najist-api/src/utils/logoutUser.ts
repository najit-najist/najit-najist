import { config } from '@config';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export const logoutUser = async (headers: Headers) => {
  const cookies = new ResponseCookies(headers);

  cookies.delete(config.server.session.cookieName);

  // headers.append('set-cookie', cookies.toString());

  return headers;
};
