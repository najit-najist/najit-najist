import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

export type FormBreakProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHRElement>,
  HTMLHRElement
>;

export const FormBreak: FC<FormBreakProps> = ({ className, ...rest }) => (
  <hr className={clsx('h-0.5 bg-gray-100 w-full', className)} {...rest} />
);
