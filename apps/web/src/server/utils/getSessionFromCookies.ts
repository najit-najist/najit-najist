import { SESSION_LENGTH_IN_SECONDS } from '@server/constants';
import { IronSessionData, unsealData } from 'iron-session';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies as getCookies } from 'next/headers';

import { config } from '../config';
import { normalizeStringPasswordToMap } from './normalizeStringPasswordToMap';

export type GetSessionFromCookiesOptions = {
  cookies?: RequestCookies | ReadonlyRequestCookies;
};

export const getSessionFromCookies = async ({
  cookies,
}: GetSessionFromCookiesOptions = {}) => {
  const cookiesList = cookies ?? getCookies();
  const sealFromCookies = cookiesList.get(config.server.session.cookieName);

  const passwordsAsMap = normalizeStringPasswordToMap(
    config.server.session.password,
  );

  const session =
    sealFromCookies?.value === undefined
      ? {}
      : await unsealData<IronSessionData>(sealFromCookies?.value, {
          password: passwordsAsMap,
          ttl: SESSION_LENGTH_IN_SECONDS,
        });

  return session;
};
