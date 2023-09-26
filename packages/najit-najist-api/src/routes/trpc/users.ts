import { t } from '@trpc';
import { getManyInputSchema, getOneUserInputSchema } from '@schemas';
import { UserService } from '@services';
import { onlyAdminProcedure } from '@trpc-procedures/protectedProcedure';

export const usersRoute = t.router({
  getMany: onlyAdminProcedure
    .input(getManyInputSchema.optional())
    .query(async ({ ctx, input }) => UserService.getMany(input)),

  getOne: onlyAdminProcedure
    .input(getOneUserInputSchema)
    .query(async ({ ctx, input }) => UserService.getBy('id', input.where.id)),
});
