import { Hr as HrBase, HrProps } from '@react-email/components';
import clsx from 'clsx';
import { FC } from 'react';

export const Hr: FC<HrProps> = ({ className, ...props }) => (
  <HrBase
    className={clsx(
      'bg-slate-200 border-transparent h-[1px] my-6 mx-0',
      className,
    )}
    {...props}
  />
);
