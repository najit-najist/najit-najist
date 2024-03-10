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
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { config } from '../../../config';
import { MailService, logger } from '../../../server';

const isLocalPickup = (
  delivery: Pick<OrderDeliveryMethod, 'id' | 'name' | 'slug'>
) => delivery?.slug === 'local-pickup';

const paymentMethodRoutes = t.router({
  get: t.router({
    many: t.procedure.query(async () => {
      const paymentMethods =
        await database.query.orderPaymentMethods.findMany();

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
        z
          .object({
            user: z.object({ id: z.array(z.number()) }).optional(),
            page: z.number().min(1).default(1),
            perPage: z.number().min(1).default(15),
          })
          .default({})
      )
      .query(async ({ input, ctx }) => {
        // TODO - paginations
        const items = database.query.orders.findMany({
          orderBy: (schema, { asc }) => [asc(schema.createdAt)],
          where: (schema, { inArray }) =>
            input.user?.id.length
              ? inArray(schema.userId, input.user.id ?? [])
              : undefined,

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
        });

        return items;
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
        }
      }
    }),

  paymentMethods: paymentMethodRoutes,
  deliveryMethods: deliveryMethodRoutes,
});
