import { config } from '@config';
import { FastifyPluginAsync } from 'fastify';

export const lifeRoute: FastifyPluginAsync = async (server) => {
  server.get('/', async (req, res) => {
    let pocketbaseConnected = await fetch(
      new URL('/api/health', config.pb.origin)
    )
      .catch(() => false)
      .then(() => true);

    res.send({
      alive: true,
      pocketbaseConnected,
    });
  });
};
