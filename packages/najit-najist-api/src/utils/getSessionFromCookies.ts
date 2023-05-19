import { cookies } from 'next/headers';
import { config } from '@config';
import { IronSessionData, unsealData } from 'iron-session';
import { normalizeStringPasswordToMap } from './normalizeStringPasswordToMap';

export const getSessionFromCookies = async () => {
  const cookiesList = cookies();
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
