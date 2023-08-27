import { User } from '@najit-najist/api';
import { getTrpcCaller } from '@najit-najist/api/server';
import { notFound } from 'next/navigation';
import { Content } from './_components/Content';

type Params = { params: { userId: string } };

export default async function Page({ params }: Params) {
  let user: User;

  try {
    user = await getTrpcCaller().users.getOne({
      where: {
        id: params.userId,
      },
    });
  } catch (error) {
    return notFound();
  }

  return <Content user={user} />;
}
