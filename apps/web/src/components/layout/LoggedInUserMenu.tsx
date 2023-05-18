import { FC, PropsWithChildren } from 'react';
import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@najit-najist/ui';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { RouteType } from 'next/dist/lib/load-custom-routes';

const Column: FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => (
  <div>
    <p className="font-bold text-deep-green-300">{title}</p>
    <div className="grid gap-1 mt-2">{children}</div>
  </div>
);

const StyledLink: FC<LinkProps<RouteType>> = ({
  className,
  children,
  ...props
}) => (
  <Link className="hover:underline" {...props}>
    {children}
  </Link>
);

export const LoggedInUserMenu: FC = () => {
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx(
              'h-full aspect-square flex',
              open
                ? 'bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-600'
                : 'bg-white hover:bg-deep-green-400 hover:text-white'
            )}
          >
            {open ? (
              <XMarkIcon className="w-10 h-8 m-auto" />
            ) : (
              <Bars2Icon className="w-10 h-8 m-auto" />
            )}
          </Menu.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            className="absolute right-0 bottom-0 translate-y-full bg-white shadow-lg z-10 w-screen max-w-lg p-5 rounded-md"
          >
            <Menu.Items className="flex gap-5" static>
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
        </>
      )}
    </Menu>
  );
};
