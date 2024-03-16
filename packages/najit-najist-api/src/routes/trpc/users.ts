import { database } from '@najit-najist/database';
import { users } from '@najit-najist/database/models';
import { municipalitySchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { UserService } from '@services/UserService';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { SQL, and, getTableName, like, or, sql } from 'drizzle-orm';
import { z } from 'zod';

import { ApplicationError } from '../../errors/ApplicationError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { defaultGetManyPagedSchema } from '../../schemas/base.get-many.schema';
import { userUpdateInputSchema } from '../../schemas/userUpdateInputSchema';
import { ErrorCodes } from '../../types/ErrorCodes';

export const usersRoute = t.router({
  getMany: onlyAdminProcedure
    .input(
      defaultGetManyPagedSchema
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

      const [items, [{ count }]] = await Promise.all([
        database.query.users.findMany({
          where: (schema, { and }) => and(...conditions),
          with: {
            telephone: true,
            address: {
              with: {
                municipality: true,
              },
            },
          },
          limit: perPage,
          offset: (page - 1) * perPage,
          orderBy: (schema, { desc }) => [desc(schema.createdAt)],
        }),
        database
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(users)
          .where(and(...conditions)),
      ]);

      return {
        items,
        totalItems: count,
        page,
        totalPages: Math.max(1, Math.floor(count / perPage)),
      };
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
                  where: (schema, { eq, and }) =>
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
          throw new EntityNotFoundError({ entityName: getTableName(users) });
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
        telephone,
        address: address
          ? { ...address, municipalityId: address.municipality?.id }
          : undefined,
      });
    }),
});
