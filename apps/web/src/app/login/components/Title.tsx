import { Logo } from '@components/common/Logo';
import Link from 'next/link';
import { FC } from 'react';

export const Title: FC = () => (
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <Link href="/">
      <Logo className="h-16 w-auto mx-auto" />
    </Link>
    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
      Přihlásit se k mému účtu
    </h2>
    <p className="mt-2 text-center text-sm text-gray-600">
      Nebo{' '}
      <Link
        href="/registrace"
        className="font-medium text-indigo-600 hover:text-indigo-500"
      >
        zaregistrovat se
      </Link>
    </p>
  </div>
);
