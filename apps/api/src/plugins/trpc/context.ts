import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { FastifyInstance } from 'fastify';

export const createContext = (server: FastifyInstance) => {
  return ({ req }: CreateFastifyContextOptions) => {
    // TODO
    //return { services: server.services, user: req.loggedUser };

    return {};
  };
};

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
