import { cva, VariantProps } from 'class-variance-authority';
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';

type PaperVariantProps = VariantProps<typeof paperStyles>;

export const paperStyles = cva('border-2 border-gray-100 bg-white rounded-lg', {
  variants: {
    shadow: {
      none: '',
      sm: 'shadow-sm',
      normal: 'shadow',
    },
  },
  defaultVariants: {
    shadow: 'none',
  },
});

export type PaperProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  PaperVariantProps;

export const Paper: FC<PropsWithChildren<PaperProps>> = ({
  shadow,
  className,
  ...rest
}) => {
  return <div className={paperStyles({ shadow, className })} {...rest}></div>;
};
