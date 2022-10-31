import fp from 'fastify-plugin';
import fastifyRateLimit from '@fastify/rate-limit';

export const rateLimitPlugin = fp(async (server) => {
  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
});
