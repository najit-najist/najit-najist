import { Logo } from '@components/common/Logo';
import { EntityNotFoundError } from '@najit-najist/api';
import { ProfileService, logger } from '@najit-najist/api/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BottomLinks } from './components/BottomLinks';
import { Form } from './components/Form';
import { Title } from './components/Title';

export const metadata = {
  title: 'Dokončení změny hesla',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { token: string } }) {
  if (!params.token) {
    notFound();
  }

  const userForToken = await ProfileService.getUserForPasswordResetToken(
    params.token
  ).catch((error) => {
    if (error instanceof EntityNotFoundError) {
      notFound();
    }

    logger.error(
      { error, token: params.token },
      'Failed to get user from token, its expired or invalid'
    );

    return undefined;
  });

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto">
      {userForToken ? (
        <>
          <Title />

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6">
              <Form token={params.token} />
            </div>
            <BottomLinks />
          </div>
        </>
      ) : (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/">
            <Logo className="h-28 w-auto mx-auto" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Váš odkaz je neplatný nebo propadlý, zažádejte si znovu o obnovu
            hesla.
          </h2>
          <p className="mt-8 text-center flex gap-4 justify-center flex-wrap text-sm w-full text-gray-600">
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              domů
            </Link>
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              přihlásit se
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
