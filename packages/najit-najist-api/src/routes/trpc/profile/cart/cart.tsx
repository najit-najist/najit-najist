import { config } from '@config';
import {
  renderAsync,
  ThankYouOrder,
  ThankYouOrderAdmin,
} from '@najit-najist/email-templates';
import { pocketbase, pocketbaseByCollections } from '@najit-najist/pb';
import {
  DeliveryMethod,
  OrderPaymentMethod,
  ProductStock,
  checkoutCartSchema,
} from '@schemas';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { TRPCError } from '@trpc/server';
import { getCurrentCart } from '@utils/server/getCurrentUserCart';
import { getOrderById } from '@utils/server/getOrderById';
import { z } from 'zod';

import { AUTHORIZATION_HEADER } from '../../../../constants';
import {
  addToCartSchema,
  userCartProductSchema,
} from '../../../../schemas/profile/cart/cart.schema';
import {
  MailService,
  createRequestPocketbaseRequestOptions,
  logger,
} from '../../../../server';

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
        const requestOptions = createRequestPocketbaseRequestOptions(ctx);
        const productStock = await pocketbaseByCollections.productStocks
          .getFirstListItem<ProductStock>(
            `product="${input.product.id}"`,
            requestOptions
          )
          .catch(() => undefined);

        if (productStock?.count === 0) {
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
            },
            requestOptions
          );

          return;
        }

        await pocketbaseByCollections.userCartProducts.create(
          {
            product: input.product.id,
            cart: currentCart.id,
            count: input.count,
          },
          requestOptions
        );
      }),

    update: protectedProcedure
      .input(
        addToCartSchema.omit({ count: true }).extend({
          count: z.number().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const cart = await getCurrentCart();
        const existingProductInCart = cart.products.find(
          ({ product }) => product.id === input.product.id
        );

        if (existingProductInCart) {
          await pocketbaseByCollections.userCartProducts.update(
            existingProductInCart.id,
            {
              count: input.count,
            },
            createRequestPocketbaseRequestOptions(ctx)
          );

          return;
        }

        await pocketbaseByCollections.userCartProducts.create(
          {
            product: input.product.id,
            cart: cart.id,
            count: input.count,
          },
          createRequestPocketbaseRequestOptions(ctx)
        );
      }),

    remove: protectedProcedure
      .input(z.object({ product: userCartProductSchema.pick({ id: true }) }))
      .mutation(async ({ input, ctx }) => {
        // Check that it exists first
        const cartProduct =
          await pocketbaseByCollections.userCartProducts.getFirstListItem(
            `product.id="${input.product.id}"`,
            createRequestPocketbaseRequestOptions(ctx)
          );

        await pocketbaseByCollections.userCartProducts.delete(
          cartProduct.id,
          createRequestPocketbaseRequestOptions(ctx)
        );
      }),
  }),

  checkout: protectedProcedure
    .input(
      checkoutCartSchema.superRefine(async (value, ctx) => {
        const [paymentMethod, deliveryMethod] = await Promise.all([
          pocketbaseByCollections.orderPaymentMethods
            .getOne<OrderPaymentMethod>(value.paymentMethod.id)
            .catch(() => undefined),
          pocketbaseByCollections.orderDeliveryMethods
            .getOne<DeliveryMethod>(value.deliveryMethod.id)
            .catch(() => undefined),
        ]);

        // We dont need to check delivery method now, we attach payment method only to order
        if (!paymentMethod) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Vybraný způsob platby neznáme, vyberte jiný',
            fatal: true,
            path: ['paymentMethod.id'],
          });
        } else if (
          !deliveryMethod ||
          paymentMethod.except_delivery_methods.includes(
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
      const cart = await getCurrentCart();

      if (!cart.products.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Žádné produkty v košíku',
        });
      }

      const created = await pocketbase
        .send<{ newOrder: { id: string } }>('/cart/checkout', {
          method: 'POST',
          headers: {
            ...(ctx.sessionData.token
              ? { [AUTHORIZATION_HEADER]: ctx.sessionData.token }
              : null),
          },
          body: {
            address_houseNumber: input.address.houseNumber,
            address_streetName: input.address.streetName,
            address_city: input.address.city,
            address_postalCode: input.address.postalCode,
            address_municipality_id: input.address.municipality.id,
            email: input.email,
            telephoneNumber: input.telephoneNumber,
            firstName: input.firstName,
            lastName: input.lastName,
            payment_method_id: input.paymentMethod.id,
            delivery_method_id: input.deliveryMethod.id,
            save_address: String(input.saveAddressToAccount),
          },
        })
        .catch((error) => {
          logger.error(error, 'Failed to checkout cart inside pocketbase');

          throw error;
        });

      const order = await getOrderById(created.newOrder.id, {
        headers: {
          [AUTHORIZATION_HEADER]: ctx.sessionData.token,
        },
      });

      const [userEmailContent, adminEmailContent] = await Promise.all([
        renderAsync(
          ThankYouOrder({
            needsPayment: false,
            orderLink: `${config.app.origin}/muj-ucet/objednavky/${order.id}`,
            order,
            siteOrigin: config.app.origin,
          })
        ),
        renderAsync(
          ThankYouOrderAdmin({
            orderLink: `${config.app.origin}/administrace/objednavky/${order.id}`,
            order,
            siteOrigin: config.app.origin,
          })
        ),
      ]);

      await Promise.all([
        MailService.send({
          to: input.email,
          subject: `Objednávka #${order.id} na najitnajist.cz`,
          body: userEmailContent,
        }).catch((error) => {
          logger.error(
            { error, order },
            `Order flow - could not notify user to its email with order information`
          );
        }),
        MailService.send({
          to: config.mail.baseEmail,
          subject: `Nová objednávka #${order.id} na najitnajist.cz`,
          body: adminEmailContent,
        }).catch((error) => {
          logger.error(
            { error, order },
            `Order flow - could not notify admin to its email with order information`
          );
        }),
      ]);

      return order;
    }),
});
