'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps, FC } from 'react';

export const WatchedLink: FC<
  ComponentProps<typeof Link> & {
    activeClassName?: string;
    inactiveClassName?: string;
  }
> = ({
  children,
  activeClassName,
  inactiveClassName,
  className,
  href,
  ...rest
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      {...rest}
      href={href}
      className={clsx(
        className,
        isActive ? activeClassName : inactiveClassName,
      )}
    >
      {children}
    </Link>
  );
};
