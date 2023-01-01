import { cva, VariantProps } from 'class-variance-authority';
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';

export interface ErrorMessageProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    VariantProps<typeof rootStyles> {}

const rootStyles = cva('mt-2 text-sm text-red-600');

export const ErrorMessage: FC<PropsWithChildren<ErrorMessageProps>> = ({
  children,
  className,
  ...rest
}) => (
  <small className={rootStyles({ className })} {...rest}>
    {children}
  </small>
);
