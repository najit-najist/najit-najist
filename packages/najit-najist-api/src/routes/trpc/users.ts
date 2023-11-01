import { t } from '@trpc';
import {
  getManyInputSchema,
  getOneUserInputSchema,
  updateUserSchema,
  userSchema,
} from '@schemas';
import { UserService } from '@services';
import { onlyAdminProcedure } from '@trpc-procedures/protectedProcedure';

export const usersRoute = t.router({
  getMany: onlyAdminProcedure
    .input(getManyInputSchema.optional())
    .query(async ({ ctx, input }) => UserService.getMany(input)),

  getOne: onlyAdminProcedure
    .input(getOneUserInputSchema)
    .query(async ({ ctx, input }) => UserService.getBy('id', input.where.id)),

  update: onlyAdminProcedure
    .input(userSchema.pick({ id: true }).extend({ payload: updateUserSchema }))
    .mutation(async ({ ctx, input }) =>
      UserService.update(input, input.payload)
    ),
});
