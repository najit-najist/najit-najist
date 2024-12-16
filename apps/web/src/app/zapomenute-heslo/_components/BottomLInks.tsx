import { buttonStyles } from '@components/common/Button/buttonStyles';
import Link from 'next/link';
import { FC } from 'react';

export const BottomLinks: FC = () => {
  return (
    <div className="flex items-center justify-center mt-5 gap-5">
      <Link
        href="/"
        className={buttonStyles({ size: 'sm', appearance: 'link' })}
      >
        Domů
      </Link>

      <Link
        href="/login"
        className={buttonStyles({ size: 'sm', appearance: 'link' })}
      >
        Přihlášení
      </Link>

      <Link
        href="/registrace"
        className={buttonStyles({ size: 'sm', appearance: 'link' })}
      >
        Registrace
      </Link>

      <Link
        href="/kontakt"
        className={buttonStyles({ size: 'sm', appearance: 'link' })}
      >
        Kontakt
      </Link>
    </div>
  );
};
