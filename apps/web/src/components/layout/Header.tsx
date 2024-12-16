import { Alert } from '@components/common/Alert';
import { canUser, SpecialSections, UserActions } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { FC } from 'react';

import { DesktopMenuItem } from './DesktopMenuItem';
import { HeaderLogo } from './HeaderLogo';
import { TopHeader } from './TopHeader';

const navLinks = [
  { text: 'Úvod', href: '/' },
  { text: 'Náš příběh', href: '/#o-nas' },
  { text: 'Recepty', href: '/recepty' },
  { text: 'E-Shop', href: '/produkty' },
  { text: 'Články', href: '/clanky' },
  { text: 'Kontakt', href: '/kontakt' },
];

const BonusUserNotification = async () => {
  const loggedUser = await getCachedLoggedInUser();

  if (
    !loggedUser ||
    canUser(loggedUser, {
      action: UserActions.VIEW,
      onModel: SpecialSections.OG_PREVIEW,
    }) === false
  ) {
    return null;
  }

  return (
    <Alert rounded={false} heading="" className="z-20 relative">
      <div className="container">
        Děkujeme za přízeň. Patříte mezi skupinu lidí, kteří projevili zájem o
        náš web a přihlásili se k newsletteru na úvodním webu. Jako poděkování
        máte přístup ke speciálním videu
      </div>
    </Alert>
  );
};

export const Header: FC = async () => {
  const loggedUser = await getCachedLoggedInUser();

  return (
    <>
      {/* <BonusUserNotification /> */}
      <TopHeader
        loggedInUser={
          loggedUser
            ? {
                role: loggedUser.role,
              }
            : undefined
        }
      />
      <header className="block z-20 relative">
        <nav className="container hidden md:flex items-center">
          <HeaderLogo />
          <ul className="ml-auto flex text-right sm:text-left items-center gap-4 text-lg">
            {navLinks.map(({ text, href }) => (
              <DesktopMenuItem key={href} href={href} text={text} />
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};
