import { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import { ADMIN_EMAIL } from '@constants';

import instagramIcon from '../../../public/icons/instagram.svg';

const instagramIconSize = 30;

export const Footer: FC<PropsWithChildren> = () => {
  return (
    <footer className="grid mt-20">
      <div className="mx-auto text-center">
        <a
          className="block"
          title="Instagram page"
          href="https://www.instagram.com/najitnajist/"
        >
          <Image
            src={instagramIcon}
            alt="Instagram icon"
            width={instagramIconSize}
            height={instagramIconSize}
            className="mx-auto"
          />
        </a>

        <a
          href={`mailto:${ADMIN_EMAIL}`}
          title="Napsat email"
          className="block mt-2"
        >
          {ADMIN_EMAIL}
        </a>
      </div>
      <div className="mx-auto mt-7 opacity-70 my-2">
        2022 @ <a href="https://najitnajist.cz">NajitNajist.cz</a>
      </div>
    </footer>
  );
};
