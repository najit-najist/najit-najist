import fp from 'fastify-plugin';
import fastifyCorsPlugin from '@fastify/cors';
import { config } from '@config';

export const corsPlugin = fp(async (server) => {
  const corsOrigins = config.server.cors.allowed;

  server.log.info(
    `[Cors plugin]: Initialize - allowed cors on ${corsOrigins.toString()}`
  );

  await server.register(fastifyCorsPlugin, {
    origin: corsOrigins,
    maxAge: config.server.session.maxAge,
  });
});
