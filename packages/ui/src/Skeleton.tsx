import { cva, VariantProps } from 'class-variance-authority';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

export type SkeletonProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  VariantProps<typeof skeletonStyles>;

const skeletonStyles = cva('animate-pulse bg-gray-400', {
  variants: {
    rounded: {
      true: 'rounded-md',
      false: '',
    },
  },
  defaultVariants: {
    rounded: true,
  },
});

export const Skeleton: FC<SkeletonProps> = ({
  className,
  rounded,
  ...rest
}) => {
  return <div className={skeletonStyles({ className, rounded })} {...rest} />;
};
