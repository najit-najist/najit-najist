'use client';

import { Paper } from '@najit-najist/ui';
import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

export const Section: FC<
  PropsWithChildren<{
    className?: string;
    rootClassName?: string;
    customSpace?: boolean;
  }>
> = ({ children, className, rootClassName, customSpace }) => (
  <Paper className={clsx('w-full', rootClassName)}>
    <div
      className={clsx(
        'py-5 w-full divide-y divide-gray-200',
        className,
        customSpace ? '' : 'space-y-4 sm:space-y-5'
      )}
    >
      {children}
    </div>
  </Paper>
);
