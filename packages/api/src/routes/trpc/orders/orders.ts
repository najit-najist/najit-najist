import { database } from '@najit-najist/database';
import {
  OrderDeliveryMethod,
  OrderState,
  orders,
} from '@najit-najist/database/models';
import {
  OrderConfirmed,
  OrderShipped,
  renderAsync,
} from '@najit-najist/email-templates';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { getOrderById } from '@utils/server/getOrderById';
import { SQL, and, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { config } from '../../../config';
import { defaultGetManyPagedSchema } from '../../../schemas/base.get-many.schema';
import { MailService, logger } from '../../../server';

const isLocalPickup = (
  delivery: Pick<OrderDeliveryMethod, 'id' | 'name' | 'slug'>
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
              (exc) => exc.deliveryMethod
            ),
          }))
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
        return getOrderById(input.id);
      }),
    many: protectedProcedure
      .input(
        defaultGetManyPagedSchema
          .extend({
            user: z.object({ id: z.array(z.number()) }).optional(),
          })
          .omit({ search: true })
          .default({})
      )
      .query(async ({ input, ctx }) => {
        const { page, perPage } = input;
        // TODO - paginations

        const conditions: SQL<unknown>[] = [];

        if (input.user?.id.length) {
          conditions.push(inArray(orders.userId, input.user.id ?? []));
        }

        const [items, [{ count }]] = await Promise.all([
          database.query.orders.findMany({
            orderBy: (schema, { asc }) => [asc(schema.createdAt)],
            where: and(...conditions),
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

  update: onlyAdminProcedure
    .input(
      entityLinkSchema.extend({
        payload: z.object({ state: z.nativeEnum(OrderState) }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const order = await getOrderById(input.id);

      await database
        .update(orders)
        .set(input.payload)
        .where(eq(orders.id, order.id));

      if (input.payload.state) {
        switch (input.payload.state) {
          case 'confirmed':
            await MailService.send({
              to: order.email,
              subject: `Objednávka #${order.id} potvrzena`,
              body: await renderAsync(
                OrderConfirmed({
                  orderLink: `${config.app.origin}/muj-ucet/objednavky/${order.id}`,
                  order,
                  siteOrigin: config.app.origin,
                })
              ),
            }).catch((error) => {
              logger.error(
                { error, order },
                `Order flow confirmation - could not notify user to its email with order information`
              );
            });
            break;
          case 'shipped':
            await MailService.send({
              to: order.email,
              subject: `Objednávka #${order.id} ${
                isLocalPickup(order.deliveryMethod) ? 'připravena' : 'odeslána'
              }`,
              body: await renderAsync(
                OrderShipped({
                  orderLink: `${config.app.origin}/muj-ucet/objednavky/${order.id}`,
                  order: {
                    ...order,
                    deliveryMethod: order.deliveryMethod!,
                    paymentMethod: order.paymentMethod!,
                    address: order.address!,
                    orderedProducts: order.orderedProducts.map((product) => ({
                      ...product,
                      product: {
                        ...product.product,
                        images: product.product.images.map(({ file }) => file),
                        price: product.product.price!,
                      },
                    })),
                  },
                  siteOrigin: config.app.origin,
                })
              ),
            }).catch((error) => {
              logger.error(
                { error, order },
                `Order flow confirmation - could not notify user to its email with order information`
              );
            });
            break;
        }
      }
    }),

  paymentMethods: paymentMethodRoutes,
  deliveryMethods: deliveryMethodRoutes,
});