'use client';

import { Paper } from '@najit-najist/ui';
import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

export const Section: FC<
  PropsWithChildren<{ className?: string; rootClassName?: string }>
> = ({ children, className, rootClassName }) => (
  <Paper className={clsx('w-full', rootClassName)}>
    <div
      className={clsx(
        'py-5 w-full space-y-4 divide-y divide-gray-200 sm:space-y-5',
        className
      )}
    >
      {children}
    </div>
  </Paper>
);
