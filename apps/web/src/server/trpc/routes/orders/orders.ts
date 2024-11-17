import { database } from '@najit-najist/database';
import {
  SQL,
  and,
  eq,
  getTableName,
  inArray,
  sql,
} from '@najit-najist/database/drizzle';
import { OrderDeliveryMethod, orders } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@server/trpc/instance';
import { protectedProcedure } from '@server/trpc/procedures/protectedProcedure';
import { getOrderById } from '@server/utils/server';
import { z } from 'zod';

import { EntityNotFoundError } from '../../../errors/EntityNotFoundError';
import { defaultGetManyPagedSchema } from '../../../schemas/base.get-many.schema';
import { UserActions, canUser } from '../../../utils/canUser';

const isLocalPickup = (
  delivery: Pick<OrderDeliveryMethod, 'id' | 'name' | 'slug'>,
) => delivery?.slug === 'local-pickup';

const paymentMethodRoutes = t.router({
  get: t.router({
    many: t.procedure.query(async () => {
      const paymentMethods = await database.query.orderPaymentMethods
        .findMany({
          with: {
            exceptDeliveryMethods: {
              with: {
                deliveryMethod: true,
              },
            },
          },
        })
        .then((items) =>
          items.map((item) => ({
            ...item,
            exceptDeliveryMethods: item.exceptDeliveryMethods.map(
              (exc) => exc.deliveryMethod,
            ),
          })),
        );

      return paymentMethods;
    }),
  }),
});

const deliveryMethodRoutes = t.router({
  get: t.router({
    many: t.procedure.query(async () => {
      const deliveryMethods =
        await database.query.orderDeliveryMethods.findMany();

      return deliveryMethods;
    }),
  }),
});

export const orderRoutes = t.router({
  get: t.router({
    one: protectedProcedure
      .input(entityLinkSchema)
      .query(async ({ input, ctx }) => {
        const order = await getOrderById(input.id);

        if (
          !canUser(ctx.sessionData.user, {
            action: UserActions.UPDATE,
            onModel: orders,
          }) &&
          order.userId !== ctx.sessionData.userId
        ) {
          throw new EntityNotFoundError({
            entityName: getTableName(orders),
          });
        }

        return order;
      }),
    many: protectedProcedure
      .input(
        defaultGetManyPagedSchema
          .extend({
            user: z.object({ id: z.array(z.number()) }).optional(),
          })
          .omit({ search: true })
          .default({}),
      )
      .query(async ({ input, ctx }) => {
        const { page, perPage } = input;
        // TODO - paginations

        const conditions: SQL<unknown>[] = [];

        if (
          !canUser(ctx.sessionData.user, {
            action: UserActions.UPDATE,
            onModel: orders,
          })
        ) {
          conditions.push(eq(orders.userId, ctx.sessionData.userId));
        }

        if (input.user?.id.length) {
          conditions.push(inArray(orders.userId, input.user.id ?? []));
        }

        const [items, [{ count }]] = await Promise.all([
          database.query.orders.findMany({
            orderBy: (schema, { desc }) => [desc(schema.createdAt)],
            where: and(...conditions),
            limit: perPage,
            with: {
              orderedProducts: {
                with: {
                  product: true,
                },
              },
              paymentMethod: true,
              deliveryMethod: true,
              user: {
                columns: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
              couponPatch: {
                with: {
                  coupon: true,
                },
              },
            },
          }),

          database
            .select({
              count: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(orders)
            .where(and(...conditions)),
        ]);

        return {
          items,
          totalItems: count,
          page,
          totalPages: Math.max(1, Math.floor(count / perPage)),
        };
      }),
  }),

  paymentMethods: paymentMethodRoutes,
  deliveryMethods: deliveryMethodRoutes,
});
