import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

export type ListProps = {
  type?: 'disc' | 'decimal' | 'none';
  className?: string;
};

const listTypeToClassName: Record<NonNullable<ListProps['type']>, string> = {
  decimal: 'list-decimal pb-5',
  disc: 'list-disc pb-5',
  none: 'list-none',
};

export const List: FC<PropsWithChildren<ListProps>> = ({
  children,
  type = 'none',
  className,
}) => {
  return (
    <ul className={clsx(listTypeToClassName[type], className, 'p-0')}>
      {children}
    </ul>
  );
};

export const ListItem: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return <li className={clsx('ml-0 first mb-2', className)}>{children}</li>;
};
