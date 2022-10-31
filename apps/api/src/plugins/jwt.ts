import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { config } from '@config';

export const jwtPlugin = fp(async (server) => {
  server.log.info('[JWT plugin] Initialize');

  await server.register(fastifyJwt, {
    secret: config.server.secrets.jwt,
  });
});
