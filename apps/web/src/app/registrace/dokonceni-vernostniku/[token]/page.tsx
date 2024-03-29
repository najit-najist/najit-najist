import { Logo } from '@components/common/Logo';
import { User } from '@najit-najist/api';
import { logger } from '@najit-najist/api/server';
import { getCachedTrpcCaller } from '@server-utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Form } from './_components/Form';

export const metadata = {
  title: 'Dokončení registrace věrnostníků',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const RegistrationFinalizationPage = async ({
  params: { token },
}: {
  params: { token: string };
}) => {
  let result: User;
  const trpc = getCachedTrpcCaller();

  try {
    result = await trpc.users.getOne({
      where: {
        preregisteredUserToken: token,
      },
    });
  } catch (error) {
    logger.error(
      { error },
      'Could not finish preview user registration from token'
    );

    notFound();
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto">
      <Link href="/">
        <Logo className="h-20 w-auto mx-auto" />
      </Link>
      <div className="sm:mx-auto sm:w-full my-5">
        <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-gray-900 font-title">
          Děkujeme!
        </h2>
        {result.verified ? (
          <p className="mt-4 text-center text-xl">
            Váš účet je již aktivovaný! Nyní se stačí jen{' '}
            <Link href="/login" className="text-green-400 hover:underline">
              přihlásit!
            </Link>
          </p>
        ) : (
          <p className="mt-4 text-center text-xl text-gray-600 max-w-lg">
            Vítejte na stránce{' '}
            <span className="text-project-accent">Najít&Najíst</span>! <br />
            <br /> Pro dokončení registrace Vás poprosíme o doplnění informací k
            Vašemu účtu, aby jste mohli používat web naplno!
          </p>
        )}
      </div>

      {!result.verified ? <Form token={token} /> : null}
    </div>
  );
};

export default RegistrationFinalizationPage;
