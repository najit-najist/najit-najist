import { GA_KEY } from '@constants';
import { GA_EVENTS } from '@custom-types';
import { useMemo } from 'react';

let wasInitialized = false;

declare global {
  interface Window {
    dataLayer?: any[];
    expandGtag?: (...params: any[]) => void;
  }
}

function expand(...args: any[]) {
  window.dataLayer ||= [];
  window.dataLayer.push(arguments);
}
const init = async () => {
  if (wasInitialized) {
    return;
  }

  expand('js', new Date());
  expand('config', GA_KEY, {
    debug_mode: process.env.NODE_ENV === 'development',
  });
  console.log('[gtag] initialized');
  wasInitialized = true;
};

export const useGtag = () => {
  return useMemo(
    () => ({
      trackEvent(name: GA_EVENTS, otherOptions?: Record<string, any>) {
        if (!wasInitialized) {
          console.warn('GTAG is not yet initialized, but still tracking');
        }

        console.log('tracked', name, otherOptions);

        expand('event', name, otherOptions);
      },
      init,
    }),
    []
  );
};
