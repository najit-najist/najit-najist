import fp from 'fastify-plugin';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './context';
import { appRouter } from './router';

export const tRPCPlugin = fp(async (server) => {
  server.log.info('[tRPC plugin]: Initialize');

  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext: createContext(server) },
  });

  server.addHook('onResponse', (request, reply, done) => {
    console.log({ re: request.routerPath });

    // Some code
    done();
  });
});
