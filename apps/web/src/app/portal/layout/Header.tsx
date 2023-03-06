'use client';

import { Logo } from '@components/common/Logo';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import { useCurrentUser } from '@hooks';
import Link from 'next/link';
import { FC } from 'react';

export const Header: FC = () => {
  const { data: user } = useCurrentUser();

  return (
    <header className="flex justify-between px-5 items-center bg-white border-b-2 border-gray-100">
      <Link href="/" className="p-2 block">
        <Logo className="h-12 w-auto" />
      </Link>
      <div className="divide-x-2 space-x-4 flex items-center">
        <div>
          <BellAlertIcon width={25} />
        </div>

        <div className="flex flex-shrink-0 px-4 mt-auto">
          <div className="block w-full flex-shrink-0">
            <div className="flex items-center">
              <Link
                href="/portal/profil"
                className="h-9 w-9 bg-gray-100 rounded-full inline-block"
              ></Link>
              <div className="ml-3">
                <Link
                  href="/portal/profil"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
                >
                  {user?.firstName} {user?.lastName}
                </Link>
                <Link
                  href="/logout"
                  className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline block"
                >
                  Odhlásit se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
