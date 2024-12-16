'use client';

import { buttonStyles } from '@components/common/Button/buttonStyles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const DesktopMenuItem: FC<{ text: string; href: string }> = ({
  href,
  text,
}) => {
  const currentPathname = usePathname();
  const isMainPage = href === '/';
  const isCurrent = isMainPage
    ? currentPathname === href
    : currentPathname?.startsWith(href);

  return (
    <li>
      <Link
        className={buttonStyles({
          className: 'font-title !rounded-full !px-7',
          appearance: isCurrent ? 'solid' : 'filled',
        })}
        href={href}
      >
        {text}
      </Link>
    </li>
  );
};
