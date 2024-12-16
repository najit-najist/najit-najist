import { buttonStyles } from '@components/common/Button/buttonStyles';
import Link from 'next/link';
import { FC } from 'react';

export const BottomLinks: FC = () => {
  return (
    <div className="flex items-center justify-center mt-5 gap-5">
      <Link
        href="/"
        className={buttonStyles({ appearance: 'link', size: 'sm' })}
      >
        Domů
      </Link>
      <Link
        href="/kontakt"
        className={buttonStyles({ appearance: 'link', size: 'sm' })}
      >
        Kontakt
      </Link>
    </div>
  );
};
