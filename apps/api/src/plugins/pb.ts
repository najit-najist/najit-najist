import { config } from '@config';
import { ApplicationMode } from '@custom-types';
import type { PocketBase } from '@najit-najist/pb';
import fp from 'fastify-plugin';

import 'cross-fetch/polyfill';

declare module 'fastify' {
  interface FastifyInstance {
    pb: PocketBase;
  }
}

export const pocketBasePlugin = fp<{ mode: ApplicationMode }>(
  async (server) => {
    const { PocketBase } = await import('@najit-najist/pb');

    await server.decorate('pb', new PocketBase(config.pb.origin));
  }
);
