import { dayjs } from '@dayjs';
import { SESSION_LENGTH_IN_SECONDS } from '@server/constants';
import { IronSessionData, sealData } from 'iron-session';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';

import { config } from '../config';
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
      ttl: SESSION_LENGTH_IN_SECONDS,
    }),
    {
      secure: true,
      httpOnly: true,
      path: '/',
      expires: dayjs().add(SESSION_LENGTH_IN_SECONDS, 'seconds').toDate(),
      sameSite: true,
    }
  );

  // headers.append('set-cookie', cookies.toString());

  return headers;
};
