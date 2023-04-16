import { SESSION_NAME } from '@najit-najist/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Content } from './Content';

export const metadata = {
  title: 'Přihlášení',
};

export default function LoginPage() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_NAME);

  // TODO: Should we check for expiry too?
  if (session) {
    redirect(`/portal`);
  }

  return <Content />;
}
