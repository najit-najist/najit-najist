import { database } from '@najit-najist/database';
import { orders, OrderState } from '@najit-najist/database/models';
import { defaultGetManyPagedSchema } from '@server/schemas/base.get-many.schema';
import { and, eq, inArray, sql, SQL } from 'drizzle-orm';
import { z } from 'zod';

import { canUser, UserActions } from './canUser';
import { getLoggedInUser } from './server';

const inputSchema = defaultGetManyPagedSchema
  .extend({
    state: z.array(z.nativeEnum(OrderState)).optional(),
  })
  .omit({ search: true })
  .default({});

export const getOrders = async (input: z.output<typeof inputSchema>) => {
  const { page, perPage, state } = input;
  const loggedInUser = await getLoggedInUser().catch(() => undefined);

  const conditions: SQL<unknown>[] = [];

  if (
    !!loggedInUser &&
    !canUser(loggedInUser, {
      action: UserActions.UPDATE,
      onModel: orders,
    })
  ) {
    conditions.push(eq(orders.userId, loggedInUser.id));
  }

  if (state?.length) {
    conditions.push(inArray(orders.state, state));
  }

  const [items, [{ count }]] = await Promise.all([
    database.query.orders.findMany({
      orderBy: (schema, { desc }) => [desc(schema.createdAt)],
      where: and(...conditions),
      limit: perPage,
      offset: (page - 1) * perPage,
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
    totalPages: Math.max(1, Math.ceil(count / perPage)),
  };
};
