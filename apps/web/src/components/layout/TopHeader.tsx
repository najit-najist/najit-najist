import { Logo } from '@components/common/Logo';
import {
  ArrowLeftOnRectangleIcon,
  Bars2Icon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useCurrentUser } from '@hooks';
import { Menu, Skeleton, Transition } from '@najit-najist/ui';
import clsx from 'clsx';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, forwardRef, PropsWithChildren, Suspense } from 'react';

const pillStyles = clsx(
  'inline-flex items-center duration-100 whitespace-nowrap hover:shadow-md shadow-ocean-700 rounded-full py-1 px-1 sm:px-3 my-2 ring ring-transparent'
);

const Column: FC<PropsWithChildren<{ title: string; className?: string }>> = ({
  children,
  title,
  className,
}) => (
  <div className={className}>
    <p className="font-bold text-lg text-deep-green-300">{title}</p>
    <div className="grid gap-1 mt-2">{children}</div>
  </div>
);

const StyledLink = forwardRef<HTMLLinkElement, LinkProps<RouteType>>(
  function StyledLink({ className, children, ...props }, ref) {
    return (
      // @ts-ignore
      <Link ref={ref} className="hover:underline" {...props}>
        {children}
      </Link>
    );
  }
);

const Content: FC<{ menuIsOpen: boolean }> = ({ menuIsOpen }) => {
  const pathname = usePathname();
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
            <span className="hidden sm:inline">Odhlásit se</span>
            <ArrowLeftOnRectangleIcon className="inline sm:hidden w-5 h-5" />
          </Link>

          <Link
            className={clsx([
              pillStyles,
              'flex justify-center',
              pathname === '/muj-ucet/profil'
                ? 'bg-deep-green-400 ring-deep-green-400 text-white'
                : 'hover:bg-deep-green-400  hover:ring-deep-green-400 hover:text-white bg-white',
            ])}
            href="/muj-ucet/profil"
          >
            <UserIcon className="w-5 h-5" />
          </Link>

          <Menu.Button
            className={clsx(
              'h-full aspect-square flex',
              menuIsOpen
                ? 'bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-600'
                : 'bg-white hover:bg-deep-green-400 hover:text-white'
            )}
          >
            {menuIsOpen ? (
              <XMarkIcon className="w-10 h-8 m-auto" />
            ) : (
              <Bars2Icon className="w-10 h-8 m-auto" />
            )}
          </Menu.Button>
        </>
      ) : (
        <Link
          href="/login"
          className={clsx(
            'inline-flex items-center',
            pillStyles,
            pathname === '/muj-ucet/profil'
              ? 'bg-deep-green-400 ring-deep-green-400 text-white'
              : 'hover:bg-deep-green-400  hover:ring-deep-green-400 hover:text-white bg-white'
          )}
        >
          <UserCircleIcon width={25} height={25} className="mr-3" /> Přihlásit
          se
        </Link>
      )}
    </>
  );
};

export const TopHeader = () => {
  return (
    <Menu>
      {({ open: menuIsOpen }) => (
        <div className="bg-transparent relative z-30">
          <div className="container flex items-center">
            <Link href="/" className="lg:hidden flex-none">
              <Logo className="h-10 w-auto" />
            </Link>

            <div className="ml-auto flex gap-3 relative">
              <Suspense
                fallback={
                  <>
                    <Skeleton
                      rounded={false}
                      className="h-[37px] w-[130px] rounded-full my-2"
                    />
                    <Skeleton
                      rounded={false}
                      className="h-[37px] w-[37px] rounded-full my-2"
                    />
                  </>
                }
              >
                <Content menuIsOpen={menuIsOpen} />
              </Suspense>
            </div>
          </div>
          <Transition
            show={menuIsOpen}
            enter="transition duration-200 ease-out"
            enterFrom="transform max-h-0 opacity-0"
            enterTo="transform max-h-[300px]opacity-100"
            leave="transition duration-200 ease-out"
            leaveFrom="transform max-h-[300px] opacity-100"
            leaveTo="transform max-h-0 opacity-0"
            className=" bg-white w-full pt-6 pb-10 rounded-md h-full transition-all overflow-hidden"
          >
            <Menu.Items
              className="container flex flex-wrap text-right sm:text-left justify-end gap-5"
              static
            >
              <Column title="Obecné" className="block lg:hidden">
                <Menu.Item>
                  <StyledLink href="/">Úvod</StyledLink>
                </Menu.Item>
                <Menu.Item>
                  <StyledLink href="/#nas-pribeh">Náš příběh</StyledLink>
                </Menu.Item>
                <Menu.Item>
                  <StyledLink href="/kontakt">Kontakt</StyledLink>
                </Menu.Item>
              </Column>
              <Column title="Uživatele">
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
              </Column>
              <Column title="Články">
                <Menu.Item>
                  <StyledLink href="/clanky">Všechny články</StyledLink>
                </Menu.Item>
                <Menu.Item>
                  <StyledLink href="/clanky/novy">Nový článek</StyledLink>
                </Menu.Item>
              </Column>
              <Column title="Recepty">
                <Menu.Item>
                  <StyledLink href="/recepty">Všechny recepty</StyledLink>
                </Menu.Item>
                <Menu.Item>
                  <StyledLink href="/recepty/novy">Nový recept</StyledLink>
                </Menu.Item>
              </Column>
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
};
