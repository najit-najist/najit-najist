import { FastifyPluginAsync } from 'fastify';
import { infoRoutes } from './info';

export const routes: FastifyPluginAsync = async (server) => {
  await server.register(async (server) => {
    await server.register(infoRoutes);
  });
};
