import { Collections, pocketbaseByCollections } from '@najit-najist/pb';
import {
  DeliveryMethod,
  Order,
  OrderPaymentMethod,
  ProductStock,
  checkoutCartSchema,
  orderStates,
} from '@schemas';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { TRPCError } from '@trpc/server';
import { getCurrentCart } from '@utils/server/getCurrentUserCart';
import { z } from 'zod';

import { AUTHORIZATION_HEADER } from '../../../..';
import {
  addToCartSchema,
  userCartProductSchema,
} from '../../../../schemas/profile/cart/cart.schema';
import { logger } from '../../../../server';

export const userCartRoutes = t.router({
  products: t.router({
    get: t.router({
      many: protectedProcedure.query(async () => {
        return getCurrentCart().then((res) => res.products);
      }),
    }),

    add: protectedProcedure
      .input(addToCartSchema)
      .mutation(async ({ input, ctx }) => {
        const productStock = await pocketbaseByCollections.productStocks
          .getFirstListItem<ProductStock>(`product="${input.product.id}"`)
          .catch(() => undefined);

        if (!productStock) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Tento produkt nevedeme',
          });
        }

        if (!productStock?.count) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Produkt není na skladě',
          });
        }

        const currentCart = await getCurrentCart();
        const existingProductInCart = currentCart.products.find(
          ({ product }) => product.id === input.product.id
        );

        if (existingProductInCart) {
          await pocketbaseByCollections.userCartProducts.update(
            existingProductInCart.id,
            {
              count: input.count + existingProductInCart.count,
            }
          );

          return;
        }

        await pocketbaseByCollections.userCartProducts.create({
          product: input.product.id,
          cart: currentCart.id,
          count: input.count,
        });
      }),

    update: protectedProcedure
      .input(
        addToCartSchema.omit({ count: true }).extend({
          count: z.number().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const productStock = await pocketbaseByCollections.productStocks
          .getFirstListItem<ProductStock>(`product="${input.product.id}"`)
          .catch(() => undefined);

        if (!productStock) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Tento produkt nevedeme',
          });
        }

        const cart = await getCurrentCart();
        const existingProductInCart = cart.products.find(
          ({ product }) => product.id === input.product.id
        );

        if (existingProductInCart) {
          await pocketbaseByCollections.userCartProducts.update(
            existingProductInCart.id,
            {
              count: input.count,
            }
          );

          return;
        }

        await pocketbaseByCollections.userCartProducts.create({
          product: input.product.id,
          cart: cart.id,
          count: input.count,
        });
      }),

    remove: protectedProcedure
      .input(z.object({ product: userCartProductSchema.pick({ id: true }) }))
      .mutation(async ({ input, ctx }) => {
        // Check that it exists first
        const cartProduct =
          await pocketbaseByCollections.userCartProducts.getFirstListItem(
            `product.id="${input.product.id}"`
          );

        await pocketbaseByCollections.userCartProducts.delete(cartProduct.id);
      }),
  }),

  checkout: protectedProcedure
    .input(
      checkoutCartSchema.superRefine(async (value, ctx) => {
        const [paymentMethods, deliveryMethods] = await Promise.all([
          pocketbaseByCollections.orderPaymentMethods.getFullList<OrderPaymentMethod>(
            {
              perPage: 99999,
            }
          ),
          pocketbaseByCollections.orderDeliveryMethods.getFullList<DeliveryMethod>(
            {
              perPage: 99999,
            }
          ),
        ]);

        const selectedPaymentMethod = paymentMethods.find(
          ({ id }) => id === value.paymentMethod.id
        );

        const selectedDeliveryMethod = deliveryMethods.find(
          ({ id }) => id === value.deliveryMethod.id
        );

        // We dont need to check delivery method now, we attach payment method only to order
        if (!selectedPaymentMethod) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Vybraný způsob platby neznáme, vyberte jiný',
            fatal: true,
            path: ['paymentMethod.id'],
          });
        } else if (
          !selectedDeliveryMethod ||
          selectedPaymentMethod.except_delivery_methods.includes(
            value.deliveryMethod.id
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Vybraný způsob dopravy neznáme, vyberte jinou',
            fatal: true,
            path: ['deliveryMethod.id'],
          });
        }
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [cart, selectedPaymentMethod] = await Promise.all([
        getCurrentCart(),
        pocketbaseByCollections.orderPaymentMethods.getOne<OrderPaymentMethod>(
          input.paymentMethod.id,
          {
            headers: {
              [AUTHORIZATION_HEADER]: ctx.sessionData.token,
            },
          }
        ),
      ]);

      if (!cart.products.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Žádné produkty v košíku',
        });
      }

      type OrderCreatePayload = Omit<
        Order,
        | 'user'
        | 'payment_method'
        | 'delivery_method'
        | 'address_municipality'
        | 'created'
        | 'id'
        | 'products'
      > & {
        user?: string;
        delivery_method: string;
        payment_method: string;
        address_municipality: string;
      };

      const createPayload: OrderCreatePayload = {
        subtotal: cart.price.subtotal,
        user: ctx.sessionData.user.id,

        address_houseNumber: input.address.houseNumber,
        address_streetName: input.address.streetName,
        address_city: input.address.city,
        address_postalCode: input.address.postalCode,
        address_municipality: input.address.municipality.id,

        email: input.email,
        telephoneNumber: input.telephoneNumber,

        firstName: input.firstName,
        lastName: input.lastName,

        payment_method: input.paymentMethod.id,
        delivery_method: input.deliveryMethod.id,
        state: selectedPaymentMethod.payment_on_checkout
          ? orderStates.Values.unpaid
          : orderStates.Values.unconfirmed,
      };

      const order = await pocketbaseByCollections.orders.create<
        Omit<Order, 'products'>
      >(createPayload, {
        headers: {
          [AUTHORIZATION_HEADER]: ctx.sessionData.token,
        },
      });

      await Promise.all(
        cart.products.map((cartItem) => {
          return pocketbaseByCollections.orderProducts.create(
            {
              product: cartItem.product.id,
              order: order.id,
              count: cartItem.count,
              totalPrice: cartItem.product.price.value * cartItem.count,
            },
            {
              requestKey: null,
              headers: {
                [AUTHORIZATION_HEADER]: ctx.sessionData.token,
              },
            }
          );
        })
      );

      await pocketbaseByCollections.userCarts.delete(cart.id, {
        headers: {
          [AUTHORIZATION_HEADER]: ctx.sessionData.token,
        },
      });

      if (input.saveAddressToAccount) {
        try {
          if (!ctx.sessionData.user.address?.id) {
            throw new Error(
              `User under ${ctx.sessionData.user.id} ordered but has no address stored`
            );
          }

          await pocketbaseByCollections.userAddresses.update(
            ctx.sessionData.user.address.id,
            {
              ...input.address,
              municipality: input.address.municipality.id,
            },
            {
              headers: {
                [AUTHORIZATION_HEADER]: ctx.sessionData.token,
              },
            }
          );
        } catch (error) {
          logger.error({ error }, 'Failed to update user address on order');
        }
      }

      // TODO: Send email to user and admin here

      return order;
    }),
});
