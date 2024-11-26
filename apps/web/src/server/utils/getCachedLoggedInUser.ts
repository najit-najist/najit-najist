import { cache } from 'react';

import { getLoggedInUser } from './server';

export const getCachedLoggedInUser = cache(() =>
  getLoggedInUser().catch(() => undefined),
);
