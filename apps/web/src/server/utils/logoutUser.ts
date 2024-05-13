import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { config } from '../config';

export const logoutUser = (headers: Headers) => {
  const cookies = new ResponseCookies(headers);

  cookies.delete(config.server.session.cookieName);

  // headers.append('set-cookie', cookies.toString());

  return headers;
};
