import { Logo } from '@components/common/Logo';
import { getTrpcCaller } from '@najit-najist/api/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BottomLinks } from './_components/BottomLinks';

export const metadata = {
  title: 'Dokončení registrace',
};

const RegistrationFinalizationPage = async ({
  params: { token },
}: {
  params: { token: string };
}) => {
  const trpc = getTrpcCaller();
  let activationFailed = true;

  if (!token) {
    notFound();
  }

  await trpc.profile
    .verifyRegistration({
      token,
    })
    .then(() => {
      activationFailed = false;
    })
    .catch(() => {});

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto">
      <Link href="/">
        <Logo className="h-16 w-auto mx-auto" />
      </Link>
      <div className="sm:mx-auto sm:w-full my-5">
        {activationFailed ? (
          <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-gray-900">
            Váš link je již neplatný...
          </h2>
        ) : (
          <>
            <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-gray-900 font-title">
              Vítejte!
            </h2>
            <p className="mt-4 text-center text-xl text-gray-600">
              Podařilo se vám aktivovat účet. <br /> Nyní se můžete přihlásit{' '}
              <Link href="/login" className="text-green-400 hover:underline">
                zde
              </Link>
            </p>
          </>
        )}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <BottomLinks />
      </div>
    </div>
  );
};

export default RegistrationFinalizationPage;
