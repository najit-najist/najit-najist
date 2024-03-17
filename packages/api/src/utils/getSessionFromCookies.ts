import { IronSessionData, unsealData } from 'iron-session';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies as getCookies } from 'next/headers.js';

import { config } from '../config.js';
import { normalizeStringPasswordToMap } from './normalizeStringPasswordToMap.js';

export type GetSessionFromCookiesOptions = {
  cookies?: RequestCookies;
};

export const getSessionFromCookies = async ({
  cookies,
}: GetSessionFromCookiesOptions = {}) => {
  const cookiesList = cookies ?? getCookies();
  const sealFromCookies = cookiesList.get(config.server.session.cookieName);

  const passwordsAsMap = normalizeStringPasswordToMap(
    config.server.session.password
  );

  const session =
    sealFromCookies?.value === undefined
      ? {}
      : await unsealData<IronSessionData>(sealFromCookies?.value, {
          password: passwordsAsMap,
          ttl: config.server.session.cookieOptions.maxAge,
        });

  return session;
};
