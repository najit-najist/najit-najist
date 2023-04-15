'use client';

import {
  FC,
  PropsWithChildren,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Bars3Icon,
  PresentationChartLineIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Skeleton } from '@najit-najist/ui';
import { clsx } from 'clsx';
import { Logo } from '@components/common/Logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@hooks';

const navLinks = [
  { text: 'Úvod', href: '/' },
  { text: 'Náš příběh', href: '/#o-nas' },
  { text: 'Články', href: '/clanky' },
  { text: 'Kontakt', href: '/kontakt' },
];

const useUser = () =>
  useCurrentUser({
    useErrorBoundary: false,
    retry: false,
    trpc: {
      ssr: false,
    },
  });

const ProfileButton: FC = () => {
  const { data: user } = useUser();

  if (!user) {
    return (
      <>
        <Link
          className="inline-flex items-center text-lg hover:bg-deep-green-400 hover:text-white hover:shadow-md shadow-black rounded-full py-1.5 px-3 duration-100"
          href="/login"
        >
          <UserCircleIcon width={25} height={25} className="mr-3" /> Přihlásit
          se
        </Link>
      </>
    );
  }

  return (
    <Link
      className="inline-flex items-center text-lg bg-deep-green-400 text-white rounded-full py-1.5 px-3"
      href="/portal/profil"
    >
      <UserCircleIcon width={25} height={25} className="mr-3" />{' '}
      <span>
        {user.firstName} {user.lastName}
      </span>
    </Link>
  );
};

const PortalLink: FC = () => {
  const { data: user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Link
      className="inline-flex items-center text-lg p-2 mr-3 bg-white rounded-full"
      href="/portal"
    >
      <PresentationChartLineIcon width={22} height={22} />
    </Link>
  );
};

export const TopHeader: FC<{ onBurgerClick: () => void }> = ({
  onBurgerClick,
}) => {
  return (
    <div className="bg-white sm:bg-transparent relative z-20">
      <div className="container flex py-5 sm:py-1">
        <div className="ml-auto flex items-center">
          <Suspense fallback={<Skeleton className="h-10 rounded-full w-32" />}>
            <PortalLink />
          </Suspense>
          <Suspense fallback={<></>}>
            <ProfileButton />
          </Suspense>
          <button onClick={onBurgerClick} className="block sm:hidden ml-6">
            <Bars3Icon width={35} height={35} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Header: FC<PropsWithChildren> = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isPortal = useMemo(() => pathname?.startsWith('/portal'), [pathname]);

  const toggleMobileHeader = useCallback(
    () => setMobileMenuOpen((prev) => !prev),
    [setMobileMenuOpen]
  );

  return (
    <>
      <TopHeader onBurgerClick={toggleMobileHeader} />
      {!isPortal && (
        <header
          className={clsx(
            'sm:block sm:sticky top-[-1px] left-0 z-20 bg-white',
            !mobileMenuOpen && 'hidden'
          )}
        >
          <nav className="container flex items-center">
            <Link href="/">
              <Logo className="h-16 w-auto" />
            </Link>
            <ul className="ml-auto sm:flex text-right sm:text-left items-center gap-2 text-lg">
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
