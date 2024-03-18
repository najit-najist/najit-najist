import { initTRPC } from '@trpc/server';
import { getSuperJson } from '@utils';

import { Context } from './context';

export const t = initTRPC.context<Context>().create({
  transformer: getSuperJson(),
});
