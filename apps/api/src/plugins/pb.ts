import { config } from '@config';
import { ApplicationMode } from '@custom-types';
import { PocketBase } from '@najit-najist/pb';
import fp from 'fastify-plugin';

import 'cross-fetch/dist/node-polyfill.js';

declare module 'fastify' {
  interface FastifyInstance {
    pb: PocketBase;
  }
}

export const pocketBasePlugin = fp<{ mode: ApplicationMode }>(
  async (server) => {
    await server.decorate('pb', new PocketBase(config.pb.origin));
  }
);
