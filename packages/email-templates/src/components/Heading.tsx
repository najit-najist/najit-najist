import { Heading as HeadingBase } from '@react-email/heading';
import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

// TODO: Remove after PR is merged in react email
export type HeadingProps = {
  className?: string;
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

const asToClassName: Record<HeadingProps['as'], string> = {
  h1: clsx('mt-0 text-4xl'),
  h2: clsx('mt-7 mb-0 text-3xl'),
  h3: clsx('mb-2 text-lg'),
  h4: clsx(''),
  h5: clsx(''),
  h6: clsx(''),
};

export const Heading: FC<PropsWithChildren<HeadingProps>> = ({
  className,
  as,
  children,
  ...props
}) => (
  <HeadingBase
    className={clsx(
      'leading-6 text-lg text-slate-800 my-5',
      asToClassName[as],
      className
    )}
    as={as}
    {...props}
  >
    {children}
  </HeadingBase>
);
