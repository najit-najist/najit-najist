import { lazy } from 'react';

export const Editor = lazy(
  async () => import(/* webpackPrefetch: true */ './lazy')
);
