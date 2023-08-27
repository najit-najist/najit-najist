import { isUserLoggedIn } from '@najit-najist/api/server';
import { redirect } from 'next/navigation';
import { Content } from './Content';

export const metadata = {
  title: 'Přihlášení',
};

export default async function LoginPage() {
  if (await isUserLoggedIn()) {
    redirect('/muj-ucet/profil');
  }

  return <Content />;
}
