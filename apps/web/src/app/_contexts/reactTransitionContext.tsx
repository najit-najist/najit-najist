'use client';

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useTransition,
} from 'react';

export type ReactTransitionContext = {
  isActive: boolean;
  startTransition: ReturnType<typeof useTransition>[1];
};

export const reactTransitionContext = createContext<ReactTransitionContext>({
  isActive: false,
  startTransition() {},
});

export const TransitionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isDoingTransition, doTransition] = useTransition();

  return (
    <reactTransitionContext.Provider
      value={useMemo(
        () => ({ isActive: isDoingTransition, startTransition: doTransition }),
        [isDoingTransition, doTransition],
      )}
    >
      {children}
    </reactTransitionContext.Provider>
  );
};

export const useReactTransitionContext = () =>
  useContext(reactTransitionContext);
