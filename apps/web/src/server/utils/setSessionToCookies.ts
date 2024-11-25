import {
  SESSION_LENGTH_IN_SECONDS,
  SESSION_NAME,
  sessionSecret,
} from '@constants';
import { dayjs } from '@dayjs';
import { IronSessionData, sealData } from 'iron-session';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';

import { normalizeStringPasswordToMap } from './normalizeStringPasswordToMap';

export const setSessionToCookies = async (
  session: IronSessionData,
  cookies: ResponseCookies,
) => {
  const passwordsAsMap = normalizeStringPasswordToMap(sessionSecret);

  cookies.set(
    SESSION_NAME,
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
    },
  );

  // headers.append('set-cookie', cookies.toString());

  return headers;
};
