import { trpc } from '../trpc';

export type UseCurrentUserOptions = Parameters<
  typeof trpc.profile.me.useQuery
>[1];

export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  trpc.profile.me.useQuery(undefined);
