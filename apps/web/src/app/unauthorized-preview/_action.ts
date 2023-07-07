'use server';

import { PREVIEW_AUTH_PASSWORD } from '@najit-najist/api/edge';
import {
  getSessionFromCookies,
  setSessionToCookies,
} from '@najit-najist/api/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const UNAUTHORIZED_URL = '/unauthorized-preview';

export const initiateSecretSession = async (data: FormData) => {
  const url = new URL('/', 'https://dev.najitnajist.cz');
  const code = data.get('code');

  console.log({ incomingCode: code, data });

  if (code != PREVIEW_AUTH_PASSWORD) {
    url.pathname = UNAUTHORIZED_URL;
    url.search = new URLSearchParams([['invalid', '']]).toString();

    console.log('request failed when accessing preview');

    redirect(url.toString());
  } else {
    const session = await getSessionFromCookies();

    url.pathname = '/';
    session.previewAuthorized = true;

    await setSessionToCookies(session, headers());

    return redirect(url.toString());
  }
};
