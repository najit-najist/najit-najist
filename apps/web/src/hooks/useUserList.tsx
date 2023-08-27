import { User } from '@najit-najist/api';
import { trpc } from '../trpc';

export type UseUserListOptions = Parameters<
  typeof trpc.users.getMany.useQuery<User>
>[1];

export type UseUserListInput = Parameters<
  typeof trpc.users.getMany.useQuery<User>
>[0];

export const useUserList = (
  input?: UseUserListInput,
  options?: UseUserListOptions
) => trpc.users.getMany.useQuery(input ?? {}, options);
