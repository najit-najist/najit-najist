import { useCurrentUser } from '@hooks';
import Link from 'next/link';
import { FC } from 'react';

export const ProfileInfo: FC = () => {
  const { data: user } = useCurrentUser({ suspense: true });

  return (
    <div className="flex flex-shrink-0 px-6 py-4 mt-auto border-t-2 border-gray-50">
      <div className="block w-full flex-shrink-0">
        <div className="flex items-center">
          <Link
            href="/portal/profil"
            className="h-10 w-10 bg-gray-100 rounded-full inline-block"
          />
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
  );
};
