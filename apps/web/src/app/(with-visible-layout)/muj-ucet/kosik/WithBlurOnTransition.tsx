'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { cx } from 'class-variance-authority';
import { FC, PropsWithChildren } from 'react';

export const WithBlurOnTransition: FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  const { isActive: transitionIsHappening } = useReactTransitionContext();

  return (
    <div className={cx(transitionIsHappening ? 'blur-sm' : '', className)}>
      {children}
    </div>
  );
};
