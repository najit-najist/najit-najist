import Fastify from 'fastify';

import { ApplicationMode } from '@custom-types';
import { fastifyConfig } from '@constants';
import {
  cookiePlugin,
  corsPlugin,
  mailPlugin,
  rateLimitPlugin,
  sessionPlugin,
  prismaPlugin,
  tRPCPlugin,
  servicesPlugin,
} from '@plugins';
import { routes } from 'routes';

export const bootstrap = async (
  mode: ApplicationMode = process.env.NODE_ENV !== 'production' ? 'dev' : 'prod'
) => {
  const server = Fastify({
    ...fastifyConfig,
    ...(mode === 'testing' ? { logger: false } : {}),
  });

  server.log.info('Server booting up...');

  // Initialize rate limiting on in production
  if (mode === 'prod') {
    await server.register(rateLimitPlugin);
  }

  // Do not initialize session related stuff on seeding
  if (mode !== 'seeding') {
    await server.register(cookiePlugin);
    await server.register(sessionPlugin);
    await server.register(corsPlugin);
  }

  //await server.register(jwtPlugin);
  await server.register(prismaPlugin, { mode });
  await server.register(mailPlugin);

  await server.register(servicesPlugin);

  // Do not init routes and passport on seeding
  if (mode !== 'seeding') {
    // this needs to be initialized after services
    await server.register(routes);
    await server.register(tRPCPlugin);
  }

  server.log.info('All plugins initialized!');

  return server;
};
