import {
  SESSION_LENGTH_IN_SECONDS,
  SESSION_NAME,
  sessionSecret,
} from '@constants';
import { IronSessionData, unsealData } from 'iron-session';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies as getCookies } from 'next/headers';

import { normalizeStringPasswordToMap } from './normalizeStringPasswordToMap';

export type GetSessionFromCookiesOptions = {
  cookies?: RequestCookies | ReadonlyRequestCookies;
};

export const getSessionFromCookies = async ({
  cookies,
}: GetSessionFromCookiesOptions = {}) => {
  const cookiesList = cookies ?? getCookies();
  const sealFromCookies = (await cookiesList).get(SESSION_NAME);

  const passwordsAsMap = normalizeStringPasswordToMap(sessionSecret);

  const session =
    sealFromCookies?.value === undefined
      ? {}
      : await unsealData<IronSessionData>(sealFromCookies?.value, {
          password: passwordsAsMap,
          ttl: SESSION_LENGTH_IN_SECONDS,
        });

  return session;
};
