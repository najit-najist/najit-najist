import {
  DetailedHTMLProps,
  FC,
  forwardRef,
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

export const labelStyles = cva('block text-sm font-medium text-gray-700', {
  variants: {
    type: {
      invisible: 'sr-only',
    },
  },
});

export const Label = forwardRef<
  HTMLLabelElement,
  PropsWithChildren<LabelProps>
>(function Label({ children, className, ...rest }, ref) {
  return (
    <label ref={ref} className={labelStyles({ className, ...rest })} {...rest}>
      {children}
    </label>
  );
});
