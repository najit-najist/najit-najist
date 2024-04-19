'use client';

import { Logo } from '@components/common/Logo';
import {
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, SparklesIcon } from '@heroicons/react/24/solid';
import { canUser, SpecialSections, UserActions } from '@najit-najist/api';
import { User, UserRoles } from '@najit-najist/database/models';
import { ErrorBoundary, Menu, Transition } from '@najit-najist/ui';
import { trpc } from '@trpc';
import clsx from 'clsx';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FC,
  forwardRef,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

const pillStyles = clsx(
  'inline-flex items-center min-w-[32px] text-center sm:text-left duration-100 whitespace-nowrap hover:shadow-md shadow-ocean-700 rounded-full py-1 px-3'
);

const Column: FC<PropsWithChildren<{ title: string; className?: string }>> = ({
  children,
  title,
  className,
}) => (
  <div className={className}>
    <p className="font-bold text-lg text-project-primary">{title}</p>
    <div className="grid gap-1 mt-2">{children}</div>
  </div>
);

const StyledLink = forwardRef<HTMLLinkElement, LinkProps<RouteType>>(
  function StyledLink({ className, children, ...props }, ref) {
    return (
      <Link
        // @ts-ignore
        ref={ref}
        className="hover:underline tracking-wider text-3xl text-right font-title hover:text-project-primary text-gray-800"
        {...props}
      >
        {children}
      </Link>
    );
  }
);

export type TopHeaderProps = { loggedInUser?: Pick<User, 'role'> };

const BonusPill: FC<TopHeaderProps & { hideOnMobile?: boolean }> = ({
  loggedInUser,
  hideOnMobile,
}) => {
  const pathname = usePathname();

  if (
    !loggedInUser ||
    canUser(loggedInUser, {
      action: UserActions.VIEW,
      onModel: SpecialSections.OG_PREVIEW,
    }) === false
  ) {
    return null;
  }

  return (
    <Link
      className={clsx(
        'relative',
        hideOnMobile ? 'hidden md:inline-flex' : 'inline-flex'
      )}
      href="/preview-special"
      prefetch={false}
    >
      {pathname !== '/preview-special' ? (
        <div className="absolute h-[40%] w-[60%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 duration-500">
          <span className="animate-ping absolute inline-flex rounded-full w-full h-full bg-sky-400 opacity-75"></span>
        </div>
      ) : null}
      <div
        className={clsx(
          pillStyles,
          'bg-sky-100 hover:bg-sky-200 text-sky-500 relative'
        )}
      >
        <SparklesIcon className="inline text-yellow-400 w-6 h-6 mr-2" />
        BONUS
      </div>
    </Link>
  );
};

const RegisterPill: FC<{ hideOnMobile?: boolean }> = ({ hideOnMobile }) => {
  return (
    <Link
      href="/registrace"
      className={clsx(
        ' items-center',
        hideOnMobile ? 'sm:inline-flex hidden' : 'inline-flex sm:hidden',
        pillStyles,
        'hover:bg-project-primary hover:text-white bg-white shadow-sm shadow-project-primary font-small'
      )}
    >
      Registrovat
    </Link>
  );
};

const AdministrationPill: FC<{ hideOnMobile?: boolean }> = ({
  hideOnMobile,
}) => {
  return (
    <Link
      href="/administrace"
      className={clsx(
        'items-center',
        hideOnMobile ? 'sm:inline-flex hidden' : 'inline-flex sm:hidden',
        pillStyles,
        'hover:bg-yellow-300 bg-yellow-200 text-yellow-600 shadow-sm shadow-yellow-400'
      )}
    >
      Administrace
    </Link>
  );
};

const ShoppingBagButton: FC = () => {
  const [indicatorState, setIndicatorState] = useState<
    'hide' | 'bounce' | 'stationary'
  >('hide');
  const { data: productsInCart, isLoading } =
    trpc.profile.cart.products.get.many.useQuery(undefined);
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
      className={clsx([
        pillStyles,
        'flex justify-center !px-1.5 relative shadow shadow-gray-300',
        pathname === '/muj-ucet/kosik/pokladna'
          ? 'bg-project-primary text-white'
          : 'hover:bg-project-primary hover:text-white bg-white',
      ])}
      href="/muj-ucet/kosik/pokladna"
    >
      <ShoppingBagIcon className="w-4 h-4" />
      {indicatorState !== 'hide' ? (
        <div
          className={clsx(
            'absolute -bottom-1 -left-1 bg-red-500 w-5 h-5 rounded-full text-sm flex items-center justify-center text-white',
            indicatorState === 'bounce' ? 'animate-bounce duration-300' : ''
          )}
        >
          {cartQuantity}
        </div>
      ) : null}
    </Link>
  );
};

export const TopHeader: FC<TopHeaderProps> = ({ loggedInUser }) => {
  const pathname = usePathname();

  return (
    <Menu>
      {({ open: menuIsOpen, close }) => (
        <div className="bg-transparent relative z-30">
          <div className="container flex items-center">
            <Link href="/" className="md:hidden flex-none">
              <Logo className="h-10 w-auto" />
            </Link>

            <div className="ml-auto flex gap-3  relative">
              <div className="flex gap-3 py-2 md:py-3">
                {loggedInUser ? (
                  <>
                    <BonusPill hideOnMobile loggedInUser={loggedInUser} />

                    {loggedInUser.role === UserRoles.ADMIN ? (
                      <AdministrationPill hideOnMobile />
                    ) : null}

                    <Link
                      className={clsx(
                        pillStyles,
                        'bg-red-100 hover:bg-red-200 text-red-600'
                      )}
                      href="/logout"
                      onClick={(event) => {
                        if (!confirm('Opravdu odhlásit?')) {
                          event.preventDefault();
                        }
                      }}
                      prefetch={false}
                    >
                      Odhlásit se
                    </Link>

                    <Link
                      className={clsx([
                        pillStyles,
                        'flex justify-center !px-1.5 shadow shadow-gray-300',
                        pathname === '/muj-ucet/profil'
                          ? 'bg-project-primary text-white'
                          : 'hover:bg-project-primary hover:text-white bg-white',
                      ])}
                      href="/muj-ucet/profil"
                    >
                      <UserIcon className="w-4 h-4" />
                    </Link>

                    <ErrorBoundary fallback={null}>
                      <ShoppingBagButton />
                    </ErrorBoundary>
                  </>
                ) : (
                  <>
                    <RegisterPill hideOnMobile />
                    <Link
                      href="/login"
                      className={clsx(
                        'inline-flex items-center',
                        pillStyles,
                        'bg-project-primary text-white'
                      )}
                    >
                      Přihlásit se
                    </Link>
                  </>
                )}
              </div>
              <Menu.Button
                className={clsx(
                  'h-full aspect-square',
                  'flex md:hidden',
                  menuIsOpen
                    ? 'bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-600'
                    : 'bg-white hover:bg-project-primary hover:text-white'
                )}
              >
                {menuIsOpen ? (
                  <XMarkIcon className="w-12 h-10 m-auto" />
                ) : (
                  <Bars3Icon className="w-12 h-10 m-auto" />
                )}
              </Menu.Button>
            </div>
          </div>
          <Transition
            show={menuIsOpen}
            enter="transition duration-200 ease-out"
            enterFrom="transform max-h-0 opacity-0"
            enterTo="transform max-h-[600px] sm:max-h-[300px] opacity-100"
            leave="transition duration-200 ease-out"
            leaveFrom="transform max-h-[600px] sm:max-h-[300px] opacity-100"
            leaveTo="transform max-h-0 opacity-0"
            className="bg-white w-full py-4 rounded-md h-full transition-all overflow-hidden"
          >
            <Menu.Items className="container" static>
              <div
                onClick={close}
                className="flex gap-3 justify-end mb-3 flex-wrap"
              >
                {loggedInUser && loggedInUser.role === UserRoles.ADMIN ? (
                  <AdministrationPill />
                ) : null}
                <BonusPill loggedInUser={loggedInUser} />
                {loggedInUser ? null : <RegisterPill />}
              </div>
              <div className="flex flex-col sm:flex-row sm:divide-x-2 sm:space-x-4 justify-end text-right sm:text-left items-end gap-5">
                <Column title="" className="block md:hidden">
                  <Menu.Item>
                    <StyledLink href="/">Úvod</StyledLink>
                  </Menu.Item>
                  <Menu.Item>
                    <StyledLink href="/#o-nas">Náš příběh</StyledLink>
                  </Menu.Item>
                  <Menu.Item>
                    <StyledLink href="/kontakt">Kontakt</StyledLink>
                  </Menu.Item>
                  <Menu.Item>
                    <StyledLink href="/clanky">Články</StyledLink>
                  </Menu.Item>
                  <Menu.Item>
                    <StyledLink href="/recepty">Recepty</StyledLink>
                  </Menu.Item>
                  <Menu.Item>
                    <StyledLink href="/produkty">Produkty</StyledLink>
                  </Menu.Item>
                </Column>
                {loggedInUser?.role === UserRoles.ADMIN ? (
                  <>
                    <Column title="Administrace" className="pl-8">
                      <Menu.Item>
                        <StyledLink href="/administrace/uzivatele">
                          Všichni uživatelé
                        </StyledLink>
                      </Menu.Item>
                      <Menu.Item>
                        <StyledLink href="/administrace/uzivatele/novy">
                          Nový uživatel
                        </StyledLink>
                      </Menu.Item>
                      <Menu.Item>
                        <StyledLink href="/clanky/novy">Nový článek</StyledLink>
                      </Menu.Item>
                      <Menu.Item>
                        <StyledLink href="/recepty/novy">
                          Nový recept
                        </StyledLink>
                      </Menu.Item>
                    </Column>
                  </>
                ) : null}
              </div>
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
};
