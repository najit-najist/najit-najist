import { cache } from 'react';

import { getLoggedInUser } from './server';

export const getCachedAuthenticatedUser = cache(getLoggedInUser);
