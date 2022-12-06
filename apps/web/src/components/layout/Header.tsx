'use client';

import { FC, PropsWithChildren, useCallback, useState } from 'react';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navLinks = [
  { text: 'Úvod', href: '#uvod' },
  { text: 'Náš příběh', href: '#nas-pribeh' },
  { text: 'Kontakt', href: '#kontakt' },
  { text: 'Náš Team', href: '#nas-team' },
];

export const TopHeader: FC<{ onBurgerClick: () => void }> = ({
  onBurgerClick,
}) => (
  <div className="bg-white sm:bg-transparent relative z-20">
    <div className="container flex py-5 sm:py-1">
      <div className="ml-auto flex items-center">
        <a
          className="inline-flex items-center text-lg hover:bg-deep-green-400 hover:text-white hover:shadow-md shadow-black rounded-full py-1.5 px-3 duration-100"
          href="https://portal.najitnajist.cz"
        >
          <UserCircleIcon width={25} height={25} className="mr-3" /> Přihlásit
        </a>
        <button onClick={onBurgerClick} className="block sm:hidden ml-6">
          <Bars3Icon width={35} height={35} />
        </button>
      </div>
    </div>
  </div>
);

export const Header: FC<PropsWithChildren> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileHeader = useCallback(
    () => setMobileMenuOpen((prev) => !prev),
    [setMobileMenuOpen]
  );

  return (
    <>
      <TopHeader onBurgerClick={toggleMobileHeader} />
      <header
        className={clsx(
          'sm:block sm:sticky top-[-1px] left-0 z-20 bg-white',
          !mobileMenuOpen && 'hidden'
        )}
      >
        <nav className="container flex">
          <ul className="ml-auto sm:flex text-right sm:text-left items-center gap-2 text-lg">
            {navLinks.map(({ text, href }) => (
              <li key={href}>
                <a
                  className="font-bold py-3 sm:py-8 px-6 block hover:bg-deep-green-400 hover:text-white duration-200"
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
