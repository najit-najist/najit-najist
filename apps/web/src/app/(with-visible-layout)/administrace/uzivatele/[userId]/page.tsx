import { User } from '@najit-najist/api';
import { notFound } from 'next/navigation';
import { Content } from './_components/Content';
import { getCachedTrpcCaller } from '@server-utils';

type Params = { params: { userId: string } };

export default async function Page({ params }: Params) {
  let user: User;

  try {
    user = await getCachedTrpcCaller().users.getOne({
      where: {
        id: params.userId,
      },
    });
  } catch (error) {
    return notFound();
  }

  return <Content user={user} />;
}
