import { PLAUSIBLE_EVENTS } from '@custom-types';
import { useMemo } from 'react';

type PlausibleFunctionOptions = {
  callback?: (...params: any[]) => any;
  props?: Record<string, string>;
  revenue?: { amount: number; currency: string };
};

type Plausible = ((
  id: PLAUSIBLE_EVENTS,
  options?: PlausibleFunctionOptions,
) => void) & { q: any[] };

declare global {
  interface Window {
    plausible?: Plausible;
  }
}

function pushFunction() {
  window.plausible?.q?.push(arguments);
}

pushFunction.q = [] as any[];

const getPlausible = () => {
  if (!window.plausible) {
    window.plausible ??= pushFunction;

    console.log('[plausible] initialized');
  }

  return {
    push: window.plausible!,
  };
};

export const usePlausible = () => {
  return useMemo(
    () => ({
      trackEvent(name: PLAUSIBLE_EVENTS, options?: PlausibleFunctionOptions) {
        console.log('tracked', name, options);

        getPlausible().push(name, options);
      },
    }),
    [],
  );
};
