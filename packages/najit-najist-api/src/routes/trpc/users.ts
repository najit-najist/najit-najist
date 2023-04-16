import { protectedProcedure, t } from '@trpc';
import { getManyInputSchema, getOneUserInputSchema } from '@schemas';

export const usersRoute = t.router({
  getMany: protectedProcedure
    .input(getManyInputSchema)
    .query(async ({ ctx, input }) => ctx.services.user.getMany(input)),

  getOne: protectedProcedure
    .input(getOneUserInputSchema)
    .query(async ({ ctx, input }) =>
      ctx.services.user.getBy('id', input.where.id)
    ),
});
