import { UserAvatarPicker } from '@components/common/UserAvatarPicker';
import { getAuthorizedUserOrRequestLogin } from '@server/utils/getAuthorizedUserOrRequestLogin';
import { PropsWithChildren } from 'react';

import { WatchedLink } from './_components/WatchedLink';

export default async function Layout({ children }: PropsWithChildren) {
  const user = await getAuthorizedUserOrRequestLogin();

  const navigationItems = [
    {
      label: 'Můj profil',
      href: '/muj-ucet/profil',
    },
    {
      label: (
        <>
          Moje objednávky
        </>
      ),
      href: '/muj-ucet/objednavky',
    },
    {
      label: 'Moje adresa',
      href: '/muj-ucet/adresa',
    },
  ];

  const userMenu = (
    <nav className="flex flex-1 flex-col mx-auto mt-10" aria-label="Sidebar">
      <ul role="list" className="-mx-2 space-y-1">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <WatchedLink
              href={item.href as any}
              activeClassName="bg-gray-100 text-project-accent"
              inactiveClassName="text-gray-700 hover:text-project-accent hover:bg-gray-50"
              className={
                'group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
              }
            >
              {item.label}
            </WatchedLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="container grid grid-cols-1 md:grid-cols-7 mx-auto my-5">
      <div className="col-span-2 px-5 sm:px-10 mb-5 md:mb-0 pt-5">
        <UserAvatarPicker user={{ avatar: user.avatar, id: user.id }} />
        {userMenu}
      </div>
      <div className="col-span-5">{children}</div>
    </div>
  );
}
