import { getCachedLoggedInUser } from '@server-utils';

import { Content } from './_components/Content';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Můj profil',
};

export default async function Page() {
  let user = await getCachedLoggedInUser();

  return <Content userId={user!.id} initialData={user!} />;
}
