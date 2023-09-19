import { AuthService, getTrpcCaller } from '@najit-najist/api/server';
import { Content } from './_components/Content';
import { getCachedLoggedInUser } from '@server-utils';

export const revalidate = 0;

export const metadata = {
  title: 'Můj profil',
};

export default async function Page() {
  let user = await getCachedLoggedInUser();

  return <Content userId={user!.id} initialData={user!} />;
}
