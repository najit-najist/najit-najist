import { FC } from 'react';
import { Logo } from '@components/common/Logo';
import Link from 'next/link';
import { TopHeader } from './TopHeader';
import { getCachedLoggedInUser } from '@server-utils';
import { DesktopMenuItem } from './DesktopMenuItem';

const navLinks = [
  { text: 'Úvod', href: '/' },
  { text: 'Náš příběh', href: '/#o-nas' },
  { text: 'Recepty', href: '/recepty' },
  { text: 'Produkty', href: '/produkty' },
  { text: 'Články', href: '/clanky' },
  { text: 'Kontakt', href: '/kontakt' },
];

export const Header: FC = async () => {
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
              <DesktopMenuItem key={href} href={href} text={text} />
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};
