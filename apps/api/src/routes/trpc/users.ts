import { protectedProcedure, t } from '@trpc';
import { getManyInputSchema } from '@schemas';

export const usersRoute = t.router({
  getMany: protectedProcedure
    .input(getManyInputSchema)
    .query(async ({ ctx, input }) => ctx.services.user.getMany(input)),
});
