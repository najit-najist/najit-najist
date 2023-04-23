import { SESSION_NAME } from '@najit-najist/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Content } from './Content';

export const metadata = {
  title: 'Přihlášení',
};

export default function LoginPage() {
  return <Content />;
}
