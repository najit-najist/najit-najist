import { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

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
      | { userId: string; authModel: string; token: string },
  };

  return context;
};

export type Context = inferAsyncReturnType<typeof createContext>;
