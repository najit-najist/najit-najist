import { cva, VariantProps } from 'class-variance-authority';
import {
  DetailedHTMLProps,
  FC,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';

type PaperVariantProps = VariantProps<typeof paperStyles>;
type PaperHeaderVariantProps = VariantProps<typeof paperHeaderStyles>;

export const paperStyles = cva('border-project bg-white rounded-lg', {
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

export const paperHeaderStyles = cva('px-3 font-title tracking-wide', {
  variants: {
    size: {
      default: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type PaperProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  PaperVariantProps;

export const Paper = forwardRef<HTMLDivElement, PropsWithChildren<PaperProps>>(
  function Paper({ shadow, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={paperStyles({ shadow, className })}
        {...rest}
      ></div>
    );
  },
);

export function PaperHeader({
  children,
  className,
  size,
}: PropsWithChildren<
  { className?: string } & PaperHeaderVariantProps
>): ReactNode {
  return (
    <div className={paperHeaderStyles({ className, size })}>{children}</div>
  );
}
