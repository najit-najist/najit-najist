import { config } from '@config';
import { IronSessionData, sealData } from 'iron-session';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';

import { normalizeStringPasswordToMap } from './normalizeStringPasswordToMap';

export const setSessionToCookies = async (
  session: IronSessionData,
  cookies: ResponseCookies
) => {
  const passwordsAsMap = normalizeStringPasswordToMap(
    config.server.session.password
  );

  cookies.set(
    config.server.session.cookieName,
    await sealData(session, {
      password: passwordsAsMap,
      ttl: config.server.session.cookieOptions.maxAge,
    }),
    {
      secure: true,
      httpOnly: true,
      path: '/',
      maxAge: config.server.session.cookieOptions.maxAge,
      sameSite: true,
    }
  );

  // headers.append('set-cookie', cookies.toString());

  return headers;
};
