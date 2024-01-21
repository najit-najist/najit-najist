import {
  getManyInputSchema,
  getOneUserInputSchema,
  updateUserSchema,
  userSchema,
} from '@schemas';
import { UserService } from '@services';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/protectedProcedure';

import { createRequestPocketbaseRequestOptions } from '../../server';

export const usersRoute = t.router({
  getMany: onlyAdminProcedure
    .input(getManyInputSchema.optional())
    .query(async ({ ctx, input }) =>
      UserService.getMany(input, createRequestPocketbaseRequestOptions(ctx))
    ),

  getOne: onlyAdminProcedure
    .input(getOneUserInputSchema)
    .query(async ({ ctx, input }) => {
      const byKey: Parameters<typeof UserService.getBy>[0] =
        'preregisteredUserToken' in input.where
          ? 'preregisteredUserToken'
          : 'id';

      // @ts-ignore
      const byValue = input.where[byKey as any];

      return UserService.getBy(
        byKey,
        byValue,
        createRequestPocketbaseRequestOptions(ctx)
      );
    }),

  update: onlyAdminProcedure
    .input(userSchema.pick({ id: true }).extend({ payload: updateUserSchema }))
    .mutation(async ({ ctx, input }) =>
      UserService.update(
        input,
        input.payload,
        createRequestPocketbaseRequestOptions(ctx)
      )
    ),
});
