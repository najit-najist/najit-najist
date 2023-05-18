import {
  AuthService,
  getLoggedInUser,
  isUserLoggedIn,
} from '@najit-najist/api/server';
import { redirect } from 'next/navigation';
import { Content } from './_components/Content';

export const revalidate = 0;

export const metadata = {
  title: 'Můj profil',
};

export default async function Page() {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) {
    redirect('/login');
  }

  await AuthService.authPocketBase();

  let user = await getLoggedInUser();

  // Clear auth for other connections
  AuthService.clearAuthPocketBase();

  return <Content user={user} />;
}
