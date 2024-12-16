import { buttonStyles } from '@components/common/Button/buttonStyles';
import { UserAvatarPicker } from '@components/common/UserAvatarPicker';
import { canUser, SpecialSections, UserActions } from '@server/utils/canUser';
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
      label: <>Moje objednávky</>,
      href: '/muj-ucet/objednavky',
    },
    {
      label: 'Moje adresa',
      href: '/muj-ucet/adresa',
    },
  ];

  if (
    canUser(user, {
      action: UserActions.VIEW,
      onModel: SpecialSections.OG_PREVIEW,
    })
  ) {
    navigationItems.push({
      label: 'Speciál',
      href: '/preview-special',
    });
  }

  const userMenu = (
    <nav className="flex flex-1 flex-col mx-auto mt-7" aria-label="Sidebar">
      <ul role="list" className="-mx-2 space-y-2">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <WatchedLink
              href={item.href as any}
              activeClassName={buttonStyles({ size: 'sm' })}
              inactiveClassName={buttonStyles({
                size: 'sm',
                appearance: 'ghost',
              })}
              className={
                'group flex gap-x-3 rounded-project p-2 pl-3 text-sm leading-6 font-semibold'
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
      <div className="col-span-2 sm:px-5 mb-5 md:mb-0 ">
        <UserAvatarPicker user={{ avatar: user.avatar, id: user.id }} />
        {userMenu}
      </div>
      <div className="col-span-5">{children}</div>
    </div>
  );
}
