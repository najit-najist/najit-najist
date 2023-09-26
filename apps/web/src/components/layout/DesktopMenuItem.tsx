'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const DesktopMenuItem: FC<{ text: string; href: string }> = ({
  href,
  text,
}) => {
  const currentPathname = usePathname();

  return (
    <li>
      <a
        className={clsx(
          'font-bold py-3 sm:py-8 px-6 block duration-200 font-title',
          (
            href === '/'
              ? currentPathname === href
              : currentPathname?.startsWith(href)
          )
            ? 'bg-deep-green-400 text-white '
            : 'hover:bg-deep-green-400 hover:text-white '
        )}
        href={href}
      >
        {text}
      </a>
    </li>
  );
};
