import { Logo } from '@components/common/Logo';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex-none w-64 bg-white border-r-2 border-r-gray-100">
      <Link href="/portal" className="p-5 block">
        <Logo className="h-14 w-auto" />
      </Link>
      <div className="mt-5 flex flex-grow flex-col">
        <nav className="flex-1 space-y-8 bg-white px-2" aria-label="Sidebar">
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
      </div>
    </aside>
  );
};
