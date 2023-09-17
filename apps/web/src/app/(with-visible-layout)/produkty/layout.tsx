import {
  LOGIN_THEN_REDIRECT_TO_PARAMETER,
  X_REQUEST_PATH_HEADER_NAME,
} from '@constants';
import { isUserLoggedIn } from '@najit-najist/api/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  // if (!(await isUserLoggedIn())) {
  //   const redirectTo = headers().get(X_REQUEST_PATH_HEADER_NAME);
  //   redirect(`/login?${LOGIN_THEN_REDIRECT_TO_PARAMETER}=${redirectTo}`);
  // }

  return <>{children}</>;
}
