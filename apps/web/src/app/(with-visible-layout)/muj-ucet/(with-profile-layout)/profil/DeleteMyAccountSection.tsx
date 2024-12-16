import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Section } from '@components/portal';
import Link from 'next/link';
import { FC } from 'react';

export const DeleteMyAccountSection: FC = async () => {
  return (
    <Section>
      <div className="px-5 sm:flex items-center mt-3 justify-between">
        <h1 className="text-2xl font-title tracking-wide">
          Odstranit můj účet
        </h1>
        <Link
          href="/muj-profil/odstranit"
          className={buttonStyles({
            color: 'red',
            size: 'sm',
            className: 'mt-3 sm:mt-0 text-center',
          })}
        >
          Odstranit
        </Link>
      </div>
    </Section>
  );
};
