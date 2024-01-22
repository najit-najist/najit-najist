import { Column } from '@react-email/components';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, ReactNode, TdHTMLAttributes } from 'react';

export const PaperColumn: FC<
  Readonly<
    Omit<
      DetailedHTMLProps<
        TdHTMLAttributes<HTMLTableDataCellElement>,
        HTMLTableDataCellElement
      >,
      'ref'
    >
  >
> = ({ children, className, ...rest }) => {
  return (
    <Column
      className={clsx(
        'border-solid border-2 border-gray-200 rounded-md bg-white',
        className
      )}
      {...rest}
    >
      {children}
    </Column>
  );
};
