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
    const trpcPathParam = (request.params as { path?: string })?.path;

    if (trpcPathParam) {
      const isProfilePath = trpcPathParam?.startsWith('profile.');

      if (isProfilePath && trpcPathParam !== 'profile.register') {
        // "logout" the last authenticated account to prevent impersonation so we dont have any hanging accounts in runtime
        server.pb.authStore.clear();
      }
    }

    // Some code
    done();
  });
});
