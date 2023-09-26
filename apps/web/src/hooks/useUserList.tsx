import { User } from '@najit-najist/api';
import { trpc } from '../trpc';
import { ListResult } from '@najit-najist/pb';

export type UseUserListOptions = Parameters<
  typeof trpc.users.getMany.useQuery<ListResult<User>>
>[1];

export type UseUserListInput = Parameters<
  typeof trpc.users.getMany.useQuery<ListResult<User>>
>[0];

export const useUserList = (
  input?: UseUserListInput,
  options?: UseUserListOptions
) => trpc.users.getMany.useQuery(input ?? {}, options);
