import { cx } from 'class-variance-authority';
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
  <div className={cx(className, 'relative')}>
    {label ? (
      <p className="text-md text-project-primary font-title absolute left-3 -top-3 bg-project-background px-3">
        {label}
      </p>
    ) : null}
    <hr className="h-0.5 bg-gray-100 w-full" {...rest} />
  </div>
);
