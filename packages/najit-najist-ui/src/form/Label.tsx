import {
  DetailedHTMLProps,
  FC,
  LabelHTMLAttributes,
  PropsWithChildren,
} from 'react';
import { cva, VariantProps } from 'class-variance-authority';

export interface LabelProps
  extends DetailedHTMLProps<
      LabelHTMLAttributes<HTMLLabelElement>,
      HTMLLabelElement
    >,
    VariantProps<typeof labelStyles> {}

const labelStyles = cva('block text-sm font-medium text-gray-700', {
  variants: {
    type: {
      invisible: 'sr-only',
    },
  },
});

export const Label: FC<PropsWithChildren<LabelProps>> = ({
  children,
  className,
  ...rest
}) => (
  <label className={labelStyles({ className, ...rest })} {...rest}>
    {children}
  </label>
);
