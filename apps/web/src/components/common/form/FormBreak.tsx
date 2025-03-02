import { cx } from 'class-variance-authority';
import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';

export type FormBreakProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHRElement>,
  HTMLHRElement
> & { label?: ReactNode };

export const FormBreak: FC<FormBreakProps> = ({
  className,
  label,
  ...rest
}) => (
  <div className={cx(className, 'relative')}>
    {label ? (
      <p className="text-md text-project-primary font-title absolute left-5 -top-3 bg-project-background px-3">
        {label}
      </p>
    ) : null}
    <hr className="h-0.5 bg-gray-100 w-full border-none" {...rest} />
  </div>
);
