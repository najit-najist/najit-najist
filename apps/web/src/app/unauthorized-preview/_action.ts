'use server';

import {
  getSessionFromCookies,
  setSessionToCookies,
} from '@najit-najist/api/server';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const UNAUTHORIZED_URL = '/unauthorized-preview';

export const initiateSecretSession = async (data: FormData) => {
  const url = new URL('/', 'https://najitnajist.cz');
  const code = data.get('code');

  if (code != process.env.PREVIEW_AUTH_PASSWORD) {
    url.pathname = UNAUTHORIZED_URL;
    url.search = new URLSearchParams([['invalid', '']]).toString();

    console.log('request failed when accessing preview');

    redirect(url.toString());
  } else {
    const session = await getSessionFromCookies();

    url.pathname = '/';
    session.previewAuthorized = true;

    await setSessionToCookies(session, cookies() as ResponseCookies);

    return redirect(url.toString());
  }
};
