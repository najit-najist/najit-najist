import { t } from '@lib';
import { protectedProcedure } from '../../plugins/trpc/procedures';
import { getManyInputSchema } from '@schemas';

export const usersRoute = t.router({
  getMany: protectedProcedure
    .input(getManyInputSchema)
    .query(async ({ ctx, input }) => ctx.services.user.getMany(input)),
});
