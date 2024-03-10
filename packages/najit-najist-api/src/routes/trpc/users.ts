import { database } from '@najit-najist/database';
import { users } from '@najit-najist/database/models';
import { municipalitySchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { UserService } from '@services/UserService';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { SQL, like, or } from 'drizzle-orm';
import { z } from 'zod';

import { ApplicationError } from '../../errors/ApplicationError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { userUpdateInputSchema } from '../../schemas/userUpdateInputSchema';
import { ErrorCodes } from '../../types/ErrorCodes';

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
    .query(async ({ ctx, input }) => {
      const {
        page = 1,
        perPage = 40,
        search,
        filter: filterFromOptions,
      } = input ?? {};

      const conditions: SQL<unknown>[] = [];

      if (search) {
        conditions.push(
          or(
            like(users.firstName, `%${search}%`),
            like(users.lastName, `%${search}%`),
            like(users.email, `%${search}%`)
          )!
        );
      }

      // This is complicated relation. Ideally we would use joins, but this is pocketbase...
      if (filterFromOptions?.address) {
        const addresses = await database.query.userAddresses.findMany({
          where: (schema, { inArray }) =>
            inArray(
              schema.municipalityId,
              filterFromOptions.address!.map((item) => item.id)
            ),
          columns: {
            id: true,
            municipalityId: true,
          },
        });

        if (addresses.length) {
          conditions.push();
        }
      }

      // TODO: pagination

      return database.query.users.findMany({
        where: (schema, { and }) =>
          conditions.length
            ? conditions.length === 1
              ? conditions.at(0)
              : and(...conditions)
            : undefined,
        with: {
          telephone: true,
          address: true,
        },
        orderBy: (schema, { asc }) => [asc(schema.createdAt)],
      });
    }),

  getOne: onlyAdminProcedure
    .input(
      z
        .object({
          id: z.number(),
        })
        .or(z.object({ preregisteredUserToken: z.string() }))
    )
    .query(async ({ ctx, input }) => {
      try {
        const user =
          'preregisteredUserToken' in input
            ? await database.query.previewSubscriberTokens
                .findFirst({
                  where: (schema, { eq }) =>
                    eq(schema.token, input.preregisteredUserToken),
                  with: {
                    forUser: {
                      with: {
                        address: {
                          with: {
                            municipality: true,
                          },
                        },
                        telephone: true,
                      },
                    },
                  },
                })
                .then((res) => res?.forUser)
            : await database.query.users.findFirst({
                where: (schema, { eq }) => eq(schema.id, input.id),
                with: {
                  address: {
                    with: {
                      municipality: true,
                    },
                  },
                  telephone: true,
                },
              });

        if (!user) {
          throw new EntityNotFoundError({ entityName: users._.name });
        }

        return user;
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Uživatel pod daným polem '${Object.keys(
              input
            )}' nebyl nalezen`,
            origin: 'UserService',
          });
        }

        throw error;
      }
    }),

  update: onlyAdminProcedure
    .input(entityLinkSchema.extend({ payload: userUpdateInputSchema }))
    .mutation(async ({ input }) => {
      const {
        id: userId,
        payload: { address, telephone, ...payload },
      } = input;

      const user = await UserService.forUser({ id: userId });

      user.update({
        ...payload,
        telephone: telephone ? { telephone } : undefined,
        address: address
          ? { ...address, municipalityId: address.municipality?.id }
          : undefined,
      });
    }),
});
