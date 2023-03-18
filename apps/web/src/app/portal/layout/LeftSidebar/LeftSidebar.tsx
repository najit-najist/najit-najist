'use client';

import { Logo } from '@components/common/Logo';
import {
  BellAlertIcon,
  HomeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { ProfileInfo } from './ProfileInfo';

const links = [
  {
    name: 'Domů',
    href: '/portal',
    icon: HomeIcon,
  },
  {
    name: 'Uživatelé',
    href: '/portal/uzivatele',
    icon: UserGroupIcon,
  },
];

const secondaryLinks = [
  {
    name: 'Notifikace',
    href: '/notifikace',
    icon: BellAlertIcon,
  },
];

const Divider: FC = () => <hr className="w-full bg-gray-100 h-0.5" />;

export const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="col-span-1 flex flex-col bg-white" aria-label="Sidebar">
      <Link href="/" className="px-6 pt-6 block">
        <Logo className="h-14 w-auto" />
      </Link>
      <div className="flex-grow px-6 py-8 gap-5 flex flex-col">
        <nav className="space-y-8" aria-label="Sidebar primary navigation">
          <div className="space-y-1">
            {links.map((item) => {
              const isCurrent = pathname === item.href;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    isCurrent
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={clsx(
                      isCurrent
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              );
            })}
          </div>
        </nav>
        <Divider />
        <nav className="space-y-8" aria-label="Sidebar secondary navigation">
          <div className="space-y-1">
            {secondaryLinks.map((item) => {
              const isCurrent = pathname === item.href;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    isCurrent
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={clsx(
                      isCurrent
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              );
            })}
          </div>
        </nav>
      </div>
      <ProfileInfo />
    </aside>
  );
};
