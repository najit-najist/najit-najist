import fp from 'fastify-plugin';
import { ApplicationMode } from '@custom-types';
import { prisma } from '@constants';

export const prismaPlugin = fp<{ mode: ApplicationMode }>(
  async (server, { mode }) => {
    if (mode !== 'testing') {
      await prisma.$connect();
    }

    if (mode !== 'testing') {
      server.addHook('onClose', async (server) => {
        await prisma.$disconnect();
      });
    }
  }
);
