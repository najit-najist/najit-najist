import { trpc } from '@client/trpc';
import { AppRouterOutput } from '@custom-types/AppRouter';

export type UseCurrentUserOptions = Parameters<
  typeof trpc.profile.me.useQuery<AppRouterOutput['profile']['me']>
>[1];

export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  trpc.profile.me.useQuery(undefined, {
    ...options,
    enabled: typeof window !== 'undefined',
    throwOnError: false,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
