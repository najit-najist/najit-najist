import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { FastifyInstance } from 'fastify';

export const createContext = (server: FastifyInstance) => {
  return ({ req }: CreateFastifyContextOptions) => {
    return { services: server.services };
  };
};

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
