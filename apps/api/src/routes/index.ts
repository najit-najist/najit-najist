import { FastifyPluginAsync } from 'fastify';
import { lifeRoute } from './info/life';

export const routes: FastifyPluginAsync = async (server) => {
  await server.register(
    async (server) => {
      await server.register(lifeRoute, { prefix: '/life' });
    },
    {
      prefix: '/info',
    }
  );
};
