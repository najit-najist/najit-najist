'use client';

import { PageTitle } from '@components/common/PageTitle';
import { buttonStyles } from '@najit-najist/ui';
import Link from 'next/link';
import { FC } from 'react';

export const EmptyCart: FC = () => {
  return (
    <div className="text-center flex flex-col items-center my-20 justify-center">
      <PageTitle>Zatím nic v košíku...</PageTitle>
      <Link href="/produkty" className={buttonStyles()}>
        Jít nakupovat!
      </Link>
    </div>
  );
};
