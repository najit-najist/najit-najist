import { createContext, useContext, useTransition } from 'react';

export type ReactTransitionContext = {
  isActive: boolean;
  startTransition: ReturnType<typeof useTransition>[1];
};

export const reactTransitionContext = createContext<ReactTransitionContext>({
  isActive: false,
  startTransition() {},
});

export const useReactTransitionContext = () =>
  useContext(reactTransitionContext);
