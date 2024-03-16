import { UserWithRelations } from '@custom-types';
import { getCachedTrpcCaller } from '@server-utils';
import { notFound } from 'next/navigation';

import { Content } from './_components/Content';

type Params = { params: { userId: string } };

export default async function Page({ params }: Params) {
  let user: UserWithRelations;

  try {
    user = await getCachedTrpcCaller().users.getOne({
      id: Number(params.userId),
    });
  } catch (error) {
    return notFound();
  }

  return <Content user={user} />;
}
