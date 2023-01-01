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

const labelStyles = cva('block text-sm');

export const Label: FC<PropsWithChildren<LabelProps>> = ({
  children,
  className,
}) => <label className={labelStyles({ className })}>{children}</label>;
