'use client';

import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Logo } from '@components/common/Logo';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import {
  PencilSquareIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useUserCart } from '@hooks/useUserCart';
import { User, UserRoles } from '@najit-najist/database/models';
import { cx } from 'class-variance-authority';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export type TopHeaderProps = { loggedInUser?: Pick<User, 'role'> };

const RegisterPill: FC<{ hideOnMobile?: boolean }> = ({ hideOnMobile }) => (
  <Link
    href="/registrace"
    className={buttonStyles({
      size: 'xsm',
      appearance: 'filled',
      className: cx(
        'h-8',
        hideOnMobile ? 'sm:inline-flex hidden' : 'inline-flex sm:hidden',
      ),
    })}
  >
    Registrovat
  </Link>
);

const adminLinks: Array<{ label: string; href: string }> = [
  {
    label: 'Administrace',
    href: '/administrace',
  },
  {
    label: 'Objednávky',
    href: '/administrace/objednavky',
  },
  {
    label: 'Produkty',
    href: '/produkty',
  },
  {
    label: 'Uživatelé',
    href: '/administrace/uzivatele',
  },
  {
    label: 'Možnosti dopravy',
    href: '/administrace/doprava',
  },
  {
    label: 'Recepty',
    href: '/recepty',
  },
  {
    label: 'Kupóny',
    href: '/administrace/kupony',
  },
  {
    label: 'Články',
    href: '/clanky',
  },
  {
    label: 'Suroviny',
    href: '/administrace/suroviny',
  },
];

const AdministrationMenu = () => {
  return (
    <Menu as="div" className="data-[headlessui-state=open]:z-10">
      {({ open: menuIsOpen }) => (
        <div>
          <div className={cx('relative', menuIsOpen ? 'z-10' : '')}>
            <MenuButton
              className={buttonStyles({
                color: menuIsOpen ? 'red' : 'yellow',
                appearance: 'filled',
                size: 'xsm',
                className: 'h-8 sm:w-28 flex justify-center items-center',
              })}
            >
              <span className="hidden sm:block">
                {menuIsOpen ? 'Zavřít' : 'Administrace'}
              </span>
              {menuIsOpen ? (
                <XMarkIcon className="sm:ml-2 sm:-mr-1.5 w-5 h-5" />
              ) : (
                <>
                  <PencilSquareIcon className="sm:-mr-1.5 w-5 h-5 block sm:hidden" />
                </>
              )}
            </MenuButton>
          </div>
          <Transition
            as="div"
            show={menuIsOpen}
            className="absolute top-10 md:top-12 right-0 w-screen h-svh"
          >
            <TransitionChild>
              <div className="duration-200 fixed top-0 left-0 h-screen w-screen bg-gray-800/25 data-[closed]:bg-opacity-0 backdrop-blur-md data-[closed]:backdrop-blur-0" />
            </TransitionChild>
            <div className="container">
              <TransitionChild>
                <MenuItems
                  static
                  className={cx([
                    // Base styles
                    'rounded-project bg-white shadow-xl p-2 top-0 origin-top-right relative max-w-md ml-auto flex flex-col gap-1',
                    // Shared closed styles
                    'data-[closed]:opacity-0 data-[closed]:scale-50 data-[closed]:-top-3',
                    // Entering styles
                    'data-[enter]:duration-100 data-[enter]:data-[closed]:scale-50 data-[leave]:data-[closed]:-top-3',
                    // Leaving styles
                    'data-[leave]:duration-200 data-[leave]:data-[closed]:scale-50 data-[leave]:data-[closed]:-top-3',
                  ])}
                >
                  {adminLinks.map(({ href, label }) => (
                    <MenuItem key={href}>
                      <Link
                        className={buttonStyles({ appearance: 'ghost' })}
                        href={href}
                      >
                        {label}
                      </Link>
                    </MenuItem>
                  ))}
                </MenuItems>
              </TransitionChild>
            </div>
          </Transition>
        </div>
      )}
    </Menu>
  );
};

const ShoppingBagButton: FC = () => {
  const [indicatorState, setIndicatorState] = useState<
    'hide' | 'bounce' | 'stationary'
  >('hide');
  const { data: productsInCart, isPending: isLoading } = useUserCart();
  const pathname = usePathname();

  const cartQuantity = useMemo(() => {
    if (!productsInCart) {
      return null;
    }

    let total = 0;

    for (const productInCart of productsInCart) {
      total += productInCart.count;
    }

    return Math.min(99, total);
  }, [productsInCart]);

  useEffect(() => {
    let activeTimeoutId: number | null = null;

    if (
      (isLoading && indicatorState !== 'hide') ||
      (!isLoading && !productsInCart?.length)
    ) {
      setIndicatorState('hide');
    } else if (
      !isLoading &&
      !!productsInCart?.length &&
      (indicatorState === 'hide' || indicatorState === 'bounce')
    ) {
      setIndicatorState('bounce');
      activeTimeoutId = setTimeout(() => {
        setIndicatorState('stationary');
      }, 650) as unknown as number;
    }

    return () => {
      clearTimeout(activeTimeoutId ?? undefined);
    };
  }, [isLoading, indicatorState, productsInCart]);

  return (
    <Link
      className={buttonStyles({
        size: 'xsm',
        appearance: 'outlined',
        className: 'h-8 w-8 !px-1.5',
      })}
      href="/muj-ucet/kosik"
    >
      <div className="relative -z-0">
        <ShoppingBagIcon className="w-4 h-4" />
        {indicatorState !== 'hide' ? (
          <div
            className={cx(
              'absolute -bottom-3 -right-3 bg-red-500 w-5 h-5 rounded-full text-sm flex items-center justify-center text-white',
              indicatorState === 'bounce' ? 'animate-bounce duration-300' : '',
            )}
          >
            {cartQuantity}
          </div>
        ) : null}
      </div>
    </Link>
  );
};

const mobileMenuLinks: Array<{ label: string; href: string }> = [
  {
    label: 'Úvod',
    href: '/',
  },
  {
    label: 'Náš příběh',
    href: '/#o-nas',
  },
  {
    label: 'Kontakt',
    href: '/kontakt',
  },
  {
    label: 'Články',
    href: '/clanky',
  },
  {
    label: 'Recepty',
    href: '/recepty',
  },
  {
    label: 'E-Shop',
    href: '/produkty',
  },
];
const MobileMenu: FC<TopHeaderProps> = ({ loggedInUser }) => {
  return (
    <Menu as="div" className="data-[headlessui-state=open]:z-10">
      {({ open: menuIsOpen, close }) => (
        <div>
          <div className="relative z-10">
            <MenuButton
              className={buttonStyles({
                color: menuIsOpen ? 'red' : 'primary',
                appearance: 'filled',
                size: 'sm',
                className: 'md:hidden flex h-8 !pt-1.5',
              })}
            >
              {menuIsOpen ? 'Zavřít' : 'Menu'}
              {menuIsOpen ? (
                <XMarkIcon className="ml-2 -mr-1.5 w-5 h-5" />
              ) : (
                <Bars3Icon className="ml-2 -mr-1.5 w-5 h-5" />
              )}
            </MenuButton>
          </div>
          <Transition
            as="div"
            show={menuIsOpen}
            className="absolute top-10 md:top-12 right-0 w-screen h-svh"
          >
            <TransitionChild>
              <div className="duration-200 fixed top-0 left-0 h-screen w-screen bg-gray-800/25 data-[closed]:bg-opacity-0 backdrop-blur-md data-[closed]:backdrop-blur-0" />
            </TransitionChild>
            <div className="container">
              <TransitionChild>
                <MenuItems
                  static
                  className={cx([
                    // Base styles
                    'rounded-project bg-white shadow-xl p-2 top-0 origin-top-right relative',
                    // Shared closed styles
                    'data-[closed]:opacity-0 data-[closed]:scale-50 data-[closed]:-top-3',
                    // Entering styles
                    'data-[enter]:duration-100 data-[enter]:data-[closed]:scale-50 data-[leave]:data-[closed]:-top-3',
                    // Leaving styles
                    'data-[leave]:duration-200 data-[leave]:data-[closed]:scale-50 data-[leave]:data-[closed]:-top-3',
                  ])}
                >
                  <div className="flex flex-col sm:flex-row sm:divide-x-2 sm:space-x-4 justify-end text-right sm:text-left items-end gap-0 mb-3 block md:hidden">
                    {mobileMenuLinks.map(({ label, href }) => (
                      <MenuItem key={href}>
                        <Link
                          className={buttonStyles({ appearance: 'ghost' })}
                          href={href}
                        >
                          {label}
                        </Link>
                      </MenuItem>
                    ))}
                  </div>
                  <div
                    onClick={close}
                    className="flex gap-3 justify-end flex-wrap"
                  >
                    {loggedInUser ? (
                      <a
                        className={buttonStyles({
                          size: 'xsm',
                          appearance: 'filled',
                          color: 'red',
                          className: 'h-8',
                        })}
                        href="/logout"
                        onClick={(event) => {
                          if (!confirm('Opravdu odhlásit?')) {
                            event.preventDefault();
                          }
                        }}
                      >
                        Odhlásit se
                      </a>
                    ) : (
                      <RegisterPill />
                    )}
                  </div>
                </MenuItems>
              </TransitionChild>
            </div>
          </Transition>
        </div>
      )}
    </Menu>
  );
};

export const TopHeader: FC<TopHeaderProps> = ({ loggedInUser }) => {
  return (
    <div className="bg-transparent relative z-30">
      <div className="container flex items-center mt-3 md:mt-0">
        <Link href="/" className="top-1 md:hidden flex-none relative">
          <Logo className="h-10 w-auto" />
        </Link>

        <div className="ml-auto flex gap-2 items-center md:pt-2 md:pt-3">
          {loggedInUser ? (
            <>
              <a
                className={buttonStyles({
                  size: 'xsm',
                  color: 'red',
                  appearance: 'filled',
                  className: 'hidden md:block h-8',
                })}
                href="/logout"
                onClick={(event) => {
                  if (!confirm('Opravdu odhlásit?')) {
                    event.preventDefault();
                  }
                }}
              >
                Odhlásit se
              </a>
              <Link
                className={buttonStyles({
                  size: 'xsm',
                  appearance: 'outlined',
                  className: 'h-8 w-8 !px-1.5',
                })}
                title="Moje objednávky"
                href="/muj-ucet/objednavky"
              >
                <TruckIcon className="w-4 h-4" />
              </Link>

              <Link
                className={buttonStyles({
                  size: 'xsm',
                  appearance: 'outlined',
                  className: 'h-8 w-8 !px-1.5',
                })}
                href="/muj-ucet/profil"
              >
                <UserIcon className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className={buttonStyles({
                appearance: 'outlined',
                size: 'xsm',
                className: '!px-4',
              })}
            >
              Přihlásit se
            </Link>
          )}
          <ErrorBoundary fallback={null}>
            <ShoppingBagButton />
          </ErrorBoundary>
          <MobileMenu

          // loggedInUser={loggedInUser}
          />
          {loggedInUser && loggedInUser.role === UserRoles.ADMIN ? (
            <AdministrationMenu />
          ) : null}
        </div>
      </div>
    </div>
  );
};
