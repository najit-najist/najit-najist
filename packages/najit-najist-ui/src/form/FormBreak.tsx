import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

export type FormBreakProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHRElement>,
  HTMLHRElement
> & { label?: string };

export const FormBreak: FC<FormBreakProps> = ({
  className,
  label,
  ...rest
}) => (
  <div>
    {label ? (
      <p className="text-md text-deep-green-300 font-title">{label}</p>
    ) : null}
    <hr className={clsx('h-0.5 bg-gray-100 w-full', className)} {...rest} />
  </div>
);
