import clsx from 'clsx';
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';

export type PageHeaderProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  children,
  className,
  ...rest
}) => (
  <header className={clsx('py-10', className)} {...rest}>
    {children}
  </header>
);
