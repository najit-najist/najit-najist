import { config } from '@config';
import { FastifyPluginAsync } from 'fastify';

export const infoRoutes: FastifyPluginAsync = async (server) => {
  server.get('/info', (req, res) => {
    res.send("I'm alive!");
  });

  server.get('/version', (req, res) => {
    res.send(JSON.stringify({ version: config.app.version }));
  });
};
