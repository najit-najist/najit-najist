import { cache } from 'react';

import { getTrpcCaller } from './server';

export const getCachedTrpcCaller = cache(() => getTrpcCaller());
