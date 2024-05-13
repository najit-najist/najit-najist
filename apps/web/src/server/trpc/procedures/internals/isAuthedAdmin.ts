import { UserRoles } from '@najit-najist/database/models';
import { TRPCError } from '@trpc/server';

import { isAuthed } from './isAuthed';

export const isAuthedAdmin = isAuthed.unstable_pipe(({ next, ctx }) => {
  if (ctx.sessionData.user.role !== UserRoles.ADMIN) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next();
});
