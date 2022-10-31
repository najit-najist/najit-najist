import { FastifyPluginAsync } from 'fastify';

export const lifeRoute: FastifyPluginAsync = async (server) => {
  server.get('/', (req, res) => {
    res.send("I'm alive!");
  });
};
