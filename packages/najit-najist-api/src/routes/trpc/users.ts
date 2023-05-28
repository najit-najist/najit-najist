import { t } from '@trpc';
import { getManyInputSchema, getOneUserInputSchema } from '@schemas';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { UserService } from '@services';

export const usersRoute = t.router({
  getMany: protectedProcedure
    .input(getManyInputSchema)
    .query(async ({ ctx, input }) => UserService.getMany(input)),

  getOne: protectedProcedure
    .input(getOneUserInputSchema)
    .query(async ({ ctx, input }) => UserService.getBy('id', input.where.id)),
});
