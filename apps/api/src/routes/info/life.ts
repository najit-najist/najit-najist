import { config } from '@config';
import { FastifyPluginAsync } from 'fastify';

export const lifeRoute: FastifyPluginAsync = async (server) => {
  server.get('/', async (req, res) => {
    let pocketbase = await fetch(new URL('/api/health', config.pb.origin))
      .catch(() => false)
      .then((res) => res);

    res.send({
      alive: true,
      pocketbase,
    });
  });
};
