import { AUTHORIZATION_HEADER } from '@constants';
import { PocketbaseCollections } from '@custom-types';
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
import { z } from 'zod';

import {
  DeliveryMethod,
  OrderPaymentMethod,
  orderSchema,
} from '../../../schemas/orders';
import { ProductService } from '../../../server';
import { OrderWithExpand, mapPocketbaseOrder } from './_utils';

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
        const result =
          await pocketbaseByCollections.orders.getOne<OrderWithExpand>(
            input.id,
            {
              expand: `${Collections.ORDER_PRODUCTS}(order),payment_method,delivery_method,user`,
              headers: {
                [AUTHORIZATION_HEADER]: ctx.sessionData.token,
              },
            }
          );
        const mappedResult = mapPocketbaseOrder(result);

        const productsToFetch = mappedResult.products.reduce(
          (final, orderItem) => {
            final.push(getItemId(orderItem.product));

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

          for (const cartItem of mappedResult.products) {
            const productId = getItemId(cartItem.product);

            const productFromFetchedProducts = productsForOrders.find(
              ({ id }) => id === productId
            );

            if (productFromFetchedProducts) {
              cartItem.product = productFromFetchedProducts;
            }
          }
        }

        return mappedResult;
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
              expand: `${Collections.ORDER_PRODUCTS}(order),payment_method.delivery_method,user`,
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
              ...orderItem.products.map(({ product }) => getItemId(product))
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
      const requestConfig = {
        headers: {
          [AUTHORIZATION_HEADER]: ctx.sessionData.token,
        },
      };

      const result =
        await pocketbaseByCollections.orders.getOne<OrderWithExpand>(
          input.id,
          requestConfig
        );

      await pocketbaseByCollections.orders.update(
        result.id,
        input.payload,
        requestConfig
      );
    }),

  paymentMethods: paymentMethodRoutes,
  deliveryMethods: deliveryMethodRoutes,
});
