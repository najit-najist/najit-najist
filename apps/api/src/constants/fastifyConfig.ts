import { FastifyServerOptions } from 'fastify';

export const fastifyConfig: FastifyServerOptions = {
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
  maxParamLength: 5000,
  pluginTimeout: 60000, // 1 min
};
