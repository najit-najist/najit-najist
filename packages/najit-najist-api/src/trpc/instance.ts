import { initTRPC } from '@trpc/server';
import { Context } from './context';
import { getSuperJson } from '@utils';

export const t = initTRPC.context<Context>().create({
  transformer: getSuperJson(),
});
