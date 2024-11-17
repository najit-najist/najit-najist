import { cache } from 'react';

import { createTrpcCaller } from './server';

export const getCachedTrpcCaller = cache(() => createTrpcCaller());
