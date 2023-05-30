import {
  Bars2Icon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useCurrentUser } from '@hooks';
import { Menu, Skeleton, Transition } from '@najit-najist/ui';
import clsx from 'clsx';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link, { LinkProps } from 'next/link';
import { FC, forwardRef, PropsWithChildren, Suspense } from 'react';

const pillStyles = clsx(
  'inline-flex items-center duration-100 whitespace-nowrap bg-white hover:bg-deep-green-400  hover:ring-deep-green-400 hover:text-white hover:shadow-md shadow-black rounded-full py-1 px-3 my-2 ring ring-gray-100'
);

const Column: FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => (
  <div>
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
          className={clsx('inline-flex items-center', pillStyles)}
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
          <div className="container flex">
            <div className="ml-auto flex gap-3">
              <Suspense
                fallback={
                  <Skeleton className="h-[32px] w-[100px] my-2 rounded-full" />
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
            enterTo="transform max-h-40 opacity-100"
            leave="transition duration-200 ease-out"
            leaveFrom="transform max-h-40 opacity-100"
            leaveTo="transform max-h-0 opacity-0"
            className=" bg-white w-full pt-6 pb-10 rounded-md h-full transition-all overflow-hidden"
          >
            <Menu.Items className="container flex gap-5 justify-end" static>
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
