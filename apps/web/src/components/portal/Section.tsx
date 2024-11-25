'use client';

import { Paper } from '@components/common/Paper';
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
        'py-3 w-full divide-y divide-gray-200',
        className,
        customSpace ? '' : 'space-y-2 sm:space-y-3',
      )}
    >
      {children}
    </div>
  </Paper>
);
