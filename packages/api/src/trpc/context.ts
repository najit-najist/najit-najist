import { UserWithRelations } from '@services/UserService';
import { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { IronSessionData } from 'iron-session';
// Import type overrides
import 'iron-session/next';

export const createContext = ({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) => {
  const context = {
    resHeaders,
    sessionData: undefined as
      | undefined
      | (IronSessionData & { user?: UserWithRelations }),
  };

  return context;
};

export type Context = inferAsyncReturnType<typeof createContext>;
