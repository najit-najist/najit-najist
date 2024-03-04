import { municipalitySchema, userSchema } from '@najit-najist/schemas';
import { UserService } from '@services';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/protectedProcedure';
import { z } from 'zod';

import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { userUpdateInputSchema } from '../../schemas/userUpdateInputSchema';
import { createRequestPocketbaseRequestOptions } from '../../server';

export const usersRoute = t.router({
  getMany: onlyAdminProcedure
    .input(
      defaultGetManySchema
        .extend({
          filter: z
            .object({
              address: z
                .array(municipalitySchema.pick({ id: true }))
                .optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) =>
      UserService.getMany(input, createRequestPocketbaseRequestOptions(ctx))
    ),

  getOne: onlyAdminProcedure
    .input(
      z.object({
        where: z
          .object({
            id: z.string(),
          })
          .or(z.object({ preregisteredUserToken: z.string() })),
      })
    )
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
    .input(
      userSchema.pick({ id: true }).extend({ payload: userUpdateInputSchema })
    )
    .mutation(async ({ ctx, input }) => {}),
});
