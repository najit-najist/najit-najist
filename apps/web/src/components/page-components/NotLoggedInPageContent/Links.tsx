'use client';

import { buttonStyles } from '@najit-najist/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const Links: FC = () => {
  const pathname = usePathname();

  return (
    <>
      <Link
        className={buttonStyles({ color: 'sweet', appearance: 'normal' })}
        href={`/registrace?redirectTo=${pathname}`}
      >
        Registrovat se
      </Link>
      <Link
        className={buttonStyles({ color: 'sweet' })}
        href={`/login?redirectTo=${pathname}`}
      >
        Přihlásit se
      </Link>
    </>
  );
};
