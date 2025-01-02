import { Heading as HeadingBase } from '@react-email/components';
import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

// TODO: Remove after PR is merged in react email
export type HeadingProps = {
  className?: string;
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  noSpacing?: boolean;
};

const asToClassName: Record<HeadingProps['as'], string> = {
  h1: clsx('text-4xl'),
  h2: clsx('mb-0 text-3xl'),
  h3: clsx('text-lg text-project-primary'),
  h4: clsx(''),
  h5: clsx(''),
  h6: clsx(''),
};

const asToSpacingClassName = {
  h1: clsx('mt-0 mb-5'),
  h2: clsx('mt-7 mb-5'),
  h3: clsx('mb-0 mt-5'),
  h4: clsx(''),
  h5: clsx(''),
  h6: clsx(''),
};

export const Heading: FC<PropsWithChildren<HeadingProps>> = ({
  className,
  as,
  children,
  noSpacing,
  ...props
}) => (
  <HeadingBase
    className={clsx(
      'leading-6 text-lg text-slate-700 tracking-wider',
      asToClassName[as],
      !noSpacing ? asToSpacingClassName[as] : '',
      className,
    )}
    as={as}
    {...props}
  >
    {children}
  </HeadingBase>
);
