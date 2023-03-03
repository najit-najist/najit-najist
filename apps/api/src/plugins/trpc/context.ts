import { inferAsyncReturnType } from '@trpc/server';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { FastifyInstance } from 'fastify';

export const createContext = (server: FastifyInstance) => {
  return ({ req }: CreateFastifyContextOptions) => {
    return {
      services: server.services,
      pb: server.pb,
      log: server.log,
      // session: req.session,
      // sessionData: undefined as
      //   | undefined
      //   | { userId: string; authModel: string; token: string },
      jwt: server.jwt,
    };
  };
};

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
