'use client';

import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { useCookieBannerVisibility } from './cookieBannerVisibilityStore';

export const Wrapper: FC<PropsWithChildren<{ defaultOpenened?: boolean }>> = ({
  children,
  defaultOpenened,
}) => {
  const [didMount, setDidMount] = useState(false);
  const { visible, toggle } = useCookieBannerVisibility();

  useEffect(() => {
    if (!didMount) {
      toggle(defaultOpenened);
    }
    setDidMount(true);
  }, [didMount, defaultOpenened]);

  const open = (defaultOpenened && !didMount) || visible;

  return open ? children : null;
};
