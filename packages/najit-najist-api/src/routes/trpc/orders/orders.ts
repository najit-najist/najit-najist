import { config } from '@config';
import { AUTHORIZATION_HEADER } from '@constants';
import { PocketbaseCollections } from '@custom-types';
import {
  OrderConfirmed,
  OrderShipped,
  renderAsync,
} from '@najit-najist/email-templates';
import {
  Collections,
  pocketbase,
  pocketbaseByCollections,
} from '@najit-najist/pb';
import { t } from '@trpc';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';
import { createPocketbaseFilters } from '@utils/createPocketbaseFilters';
import { insertBetween } from '@utils/insertBetween';
import { getItemId } from '@utils/internal';
import { getOrderById } from '@utils/server/getOrderById';
import { z } from 'zod';

import {
  DeliveryMethod,
  OrderPaymentMethod,
  orderSchema,
} from '../../../schemas/orders';
import {
  MailService,
  ProductService,
  createRequestPocketbaseRequestOptions,
  logger,
} from '../../../server';
import { OrderWithExpand, mapPocketbaseOrder } from './_utils';

const isLocalPickup = (
  delivery: Pick<DeliveryMethod, 'id' | 'name' | 'slug'>
) => delivery?.slug === 'local-pickup';

const paymentMethodRoutes = t.router({
  get: t.router({
    many: t.procedure.query(async () => {
      const deliveryMethods = await pocketbase
        .collection(PocketbaseCollections.ORDER_PAYMENT_METHODS)
        .getFullList<OrderPaymentMethod>();

      return deliveryMethods;
    }),
  }),
});

const deliveryMethodRoutes = t.router({
  get: t.router({
    many: t.procedure.query(async () => {
      const deliveryMethods = await pocketbase
        .collection(PocketbaseCollections.ORDER_DELIVERY_METHODS)
        .getFullList<DeliveryMethod>();

      return deliveryMethods;
    }),
  }),
});

export const orderRoutes = t.router({
  get: t.router({
    one: protectedProcedure
      .input(orderSchema.pick({ id: true }))
      .query(async ({ input, ctx }) => {
        return getOrderById(input.id, {
          headers: {
            [AUTHORIZATION_HEADER]: ctx.sessionData.token,
          },
        });
      }),
    many: protectedProcedure
      .input(
        z
          .object({
            user: z.object({ id: z.array(z.string()) }).optional(),
            page: z.number().min(1).default(1),
            perPage: z.number().min(1).default(15),
          })
          .default({})
      )
      .query(async ({ input, ctx }) => {
        const result =
          await pocketbaseByCollections.orders.getList<OrderWithExpand>(
            input.page,
            input.perPage,
            {
              sort: '-created',
              filter: createPocketbaseFilters([
                !!input.user?.id.length &&
                  insertBetween(
                    input.user?.id.map((itemId) => ({
                      leftSide: 'user.id',
                      rightSide: itemId,
                    })),
                    '||'
                  ),
              ]),
              expand: `${Collections.ORDER_PRODUCTS}(order),payment_method,delivery_method,user`,
              headers: {
                [AUTHORIZATION_HEADER]: ctx.sessionData.token,
              },
            }
          );
        const mappedResult = {
          ...result,
          items: result.items.map((value) => mapPocketbaseOrder(value)),
        };

        const productsToFetch = mappedResult.items.reduce(
          (final, orderItem) => {
            final.push(
              ...(orderItem.products ?? []).map(({ product }) =>
                getItemId(product)
              )
            );

            return final;
          },
          [] as string[]
        );

        if (productsToFetch.length) {
          const { items: productsForOrders } = await ProductService.getMany({
            perPage: 99999,
            otherFilters: [
              `( ${productsToFetch.map((id) => `id="${id}"`).join(' || ')} )`,
            ],
          });

          for (const order of mappedResult.items) {
            for (const cartItem of order.products) {
              const productId = getItemId(cartItem.product);

              const productFromFetchedProducts = productsForOrders.find(
                ({ id }) => id === productId
              );

              if (productFromFetchedProducts) {
                cartItem.product = productFromFetchedProducts;
              }
            }
          }
        }

        return mappedResult;
      }),
  }),

  update: onlyAdminProcedure
    .input(
      orderSchema
        .pick({ id: true })
        .extend({ payload: orderSchema.pick({ state: true }) })
    )
    .mutation(async ({ input, ctx }) => {
      const requestConfig = createRequestPocketbaseRequestOptions(ctx);
      const order = await getOrderById(input.id, requestConfig);

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
                isLocalPickup(order.delivery_method) ? 'připravena' : 'odeslána'
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

      await pocketbaseByCollections.orders.update(
        order.id,
        input.payload,
        requestConfig
      );
    }),

  paymentMethods: paymentMethodRoutes,
  deliveryMethods: deliveryMethodRoutes,
});
