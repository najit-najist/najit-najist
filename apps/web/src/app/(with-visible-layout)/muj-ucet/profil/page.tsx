import { AuthService, getTrpcCaller } from '@najit-najist/api/server';
import { Content } from './_components/Content';

export const revalidate = 0;

export const metadata = {
  title: 'Můj profil',
};

export default async function Page() {
  await AuthService.authPocketBase();

  let user = await getTrpcCaller().profile.me();

  // Clear auth for other connections
  AuthService.clearAuthPocketBase();

  return <Content userId={user.id} initialData={user} />;
}
