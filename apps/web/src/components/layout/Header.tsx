'use client';

import { FC, PropsWithChildren, Suspense, useMemo } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Skeleton } from '@najit-najist/ui';
import { clsx } from 'clsx';
import { Logo } from '@components/common/Logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@hooks';
import { LoggedInUserMenu } from './LoggedInUserMenu';

const pillStyles = clsx(
  'inline-flex items-center duration-100 whitespace-nowrap bg-white hover:bg-deep-green-400  hover:ring-deep-green-400 hover:text-white hover:shadow-md shadow-black rounded-full py-1 px-3 my-2 ring ring-gray-100'
);

const navLinks = [
  { text: 'Úvod', href: '/' },
  { text: 'Náš příběh', href: '/#o-nas' },
  { text: 'Recepty', href: '/recepty' },
  { text: 'Články', href: '/clanky' },
  { text: 'Kontakt', href: '/kontakt' },
];

const TopHeaderItems: FC<{}> = () => {
  const { data: loggedInUser } = useCurrentUser({
    useErrorBoundary: false,
    suspense: true,
    retry: false,
    trpc: {
      ssr: false,
    },
  });

  return (
    <>
      {loggedInUser ? (
        <>
          <Link className={pillStyles} href={'/muj-ucet/profil'}>
            Můj profil
          </Link>
          <LoggedInUserMenu />
        </>
      ) : (
        <Link
          href="/login"
          className={clsx('inline-flex items-center', pillStyles)}
        >
          <UserCircleIcon width={25} height={25} className="mr-3" /> Přihlásit
          se
        </Link>
      )}
    </>
  );
};

export const TopHeader: FC = ({}) => {
  return (
    <div className="bg-transparent relative z-30">
      <div className="container flex">
        <div className="ml-auto flex gap-3">
          <Suspense fallback={<Skeleton className="h-[32px] w-[100px] my-2" />}>
            <TopHeaderItems />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export const Header: FC<PropsWithChildren> = () => {
  const pathname = usePathname();
  const isPortal = useMemo(() => pathname?.startsWith('/portal'), [pathname]);

  return (
    <>
      <TopHeader />
      {!isPortal && (
        <header
          className={clsx('sm:block sm:sticky top-[-1px] left-0 z-20 bg-white')}
        >
          <nav className="container flex items-center">
            <Link href="/">
              <Logo className="h-16 w-auto" />
            </Link>
            <ul className="ml-auto hidden sm:flex text-right sm:text-left items-center gap-2 text-lg">
              {navLinks.map(({ text, href }) => (
                <li key={href}>
                  <a
                    className={clsx(
                      'font-bold py-3 sm:py-8 px-6 block duration-200',
                      pathname === href
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
      )}
    </>
  );
};
