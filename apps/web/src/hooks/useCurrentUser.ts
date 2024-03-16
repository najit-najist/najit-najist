import { AppRouterOutput } from '@najit-najist/api';

import { trpc } from '../trpc';

export type UseCurrentUserOptions = Parameters<
  typeof trpc.profile.me.useQuery<AppRouterOutput['profile']['me']>
>[1];

export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  trpc.profile.me.useQuery(undefined, {
    ...options,
    onError() {},
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
