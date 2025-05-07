'use client';

import { Logo } from '@components/common/Logo';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const HeaderLogo = () => {
  const href = usePathname();
  const isMainPage = href === '/';

  return (
    <Link
      href="/"
      className={clsx('flex-none py-2 duration-200', isMainPage ? '-mb-7' : '')}
    >
      <Logo
        priority
        className={clsx('w-auto duration-200', isMainPage ? 'h-24' : 'h-16')}
      />
    </Link>
  );
};
