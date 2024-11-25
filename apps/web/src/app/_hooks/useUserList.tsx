import { trpc } from '@trpc/web';

export type UseUserListOptions = Parameters<
  typeof trpc.users.getMany.useQuery
>[1];

export type UseUserListInput = Parameters<
  typeof trpc.users.getMany.useQuery
>[0];

export const useUserList = (
  input?: UseUserListInput,
  options?: UseUserListOptions,
) => trpc.users.getMany.useQuery(input ?? {}, options);
