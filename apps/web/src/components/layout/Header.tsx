import { FC } from 'react';
import { clsx } from 'clsx';
import { Logo } from '@components/common/Logo';
import { X_REQUEST_PATH_HEADER_NAME } from '@constants';
import Link from 'next/link';
import { TopHeader } from './TopHeader';
import { headers } from 'next/headers';
import { getLoggedInUser } from '@najit-najist/api/server';
import { getCachedLoggedInUser } from '@server-utils';

const navLinks = [
  { text: 'Úvod', href: '/' },
  { text: 'Náš příběh', href: '/#o-nas' },
  { text: 'Recepty', href: '/recepty' },
  { text: 'Produkty', href: '/produkty' },
  { text: 'Články', href: '/clanky' },
  { text: 'Kontakt', href: '/kontakt' },
];

export const Header: FC = async () => {
  const headersList = headers();
  const currentPathname = headersList.get(X_REQUEST_PATH_HEADER_NAME);
  const loggedUser = await getCachedLoggedInUser();

  return (
    <>
      <TopHeader
        loggedInUser={
          loggedUser
            ? {
                role: loggedUser.role,
              }
            : undefined
        }
      />
      <header className="sm:block sm:sticky top-[-1px] left-0 z-20 backdrop-blur-sm bg-white bg-opacity-50">
        <nav className="container hidden md:flex items-center">
          <Link href="/" className="flex-none py-2">
            <Logo className="h-20 w-auto" />
          </Link>
          <ul className="ml-auto flex text-right sm:text-left items-center gap-2 text-lg">
            {navLinks.map(({ text, href }) => (
              <li key={href}>
                <a
                  className={clsx(
                    'font-bold py-3 sm:py-8 px-6 block duration-200 font-title',
                    (
                      href === '/'
                        ? currentPathname === href
                        : currentPathname?.startsWith(href)
                    )
                      ? 'bg-deep-green-400 text-white '
                      : 'hover:bg-deep-green-400 hover:text-white '
                  )}
                  href={href}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};
