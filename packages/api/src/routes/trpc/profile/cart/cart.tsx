import { database } from '@najit-najist/database';
import {
  OrderState,
  comgatePayments,
  orderAddresses,
  orderDeliveryMethods,
  orderPaymentMethods,
  orderedProducts,
  orders,
  productStock,
  products,
  telephoneNumbers,
  userAddresses,
  userCartProducts,
  userCarts,
} from '@najit-najist/database/models';
import {
  renderAsync,
  ThankYouOrder,
  ThankYouOrderAdmin,
} from '@najit-najist/email-templates';
import {
  EntityLink,
  entityLinkSchema,
  userCartCheckoutInputSchema,
} from '@najit-najist/schemas';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { TRPCError } from '@trpc/server';
import { getOrderById } from '@utils/server/getOrderById';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { Comgate } from '../../../../comgate';
import { config } from '../../../../config';
import { PaymentMethodsSlug } from '../../../../schemas/orderPaymentMethodCreateInputSchema';
import { userCartAddItemInputSchema } from '../../../../schemas/userCartAddItemInputSchema';
import { userCartUpdateInputSchema } from '../../../../schemas/userCartUpdateInputSchema';
import { MailService, logger } from '../../../../server';

type UserCartWithRelations = {};

export const getUserCart = async (link: EntityLink) => {
  let cart = await database.query.userCarts.findFirst({
    where: (schema, { eq }) => eq(schema.userId, link.id),
    with: {
      products: {
        orderBy: [asc(orderedProducts.createdAt)],
        with: {
          product: {
            with: {
              price: true,
              stock: true,
              images: true,
              category: true,
              onlyForDeliveryMethod: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    const [createdCart] = await database
      .insert(userCarts)
      .values({ userId: link.id })
      .returning();

    cart = {
      ...createdCart,
      products: [],
    };
  }

  let subtotal = 0;

  for (const productInCart of cart.products) {
    const { count, product } = productInCart;

    subtotal += count * (product.price?.value ?? 0);
  }

  // TODO: deselect items from cart if user is not eligible
  return { ...cart, subtotal };
};

export const userCartRoutes = t.router({
  products: t.router({
    get: t.router({
      many: protectedProcedure.query(async ({ ctx }) => {
        return getUserCart({ id: ctx.sessionData.userId }).then(
          (res) => res.products
        );
      }),
    }),

    add: protectedProcedure
      .input(userCartAddItemInputSchema)
      // TODO: improve, all those calls to db can be merged into one bigger query
      .mutation(async ({ input, ctx }) => {
        const productStock = await database.query.productStock.findFirst({
          where: (schema, { eq }) => eq(schema.productId, input.product.id),
        });

        if (productStock?.value === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Produkt není na skladě',
          });
        }

        const currentCart = await getUserCart({ id: ctx.sessionData.userId });
        const existingProductInCart = currentCart.products.find(
          ({ product }) => product.id === input.product.id
        );

        if (existingProductInCart) {
          await database
            .update(userCartProducts)
            .set({
              count: input.count + existingProductInCart.count,
            })
            .where(
              and(
                eq(userCartProducts.cartId, currentCart.id),
                eq(userCartProducts.productId, input.product.id)
              )
            );
        } else {
          await database.insert(userCartProducts).values({
            productId: input.product.id,
            cartId: currentCart.id,
            count: input.count,
          });
        }

        revalidatePath('/muj-ucet/kosik/pokladna');
      }),

    update: protectedProcedure
      .input(userCartUpdateInputSchema)
      .mutation(async ({ input, ctx }) => {
        const cart = await getUserCart({ id: ctx.sessionData.userId });
        const existingProductInCart = cart.products.find(
          ({ product }) => product.id === input.product.id
        );

        if (existingProductInCart) {
          await database
            .update(userCartProducts)
            .set({
              count: input.count,
            })
            .where(
              and(
                eq(userCartProducts.cartId, cart.id),
                eq(userCartProducts.productId, input.product.id)
              )
            );
        } else {
          await database.insert(userCartProducts).values({
            productId: input.product.id,
            cartId: cart.id,
            count: input.count,
          });
        }

        revalidatePath('/muj-ucet/kosik/pokladna');

        return {
          count: input.count,
        };
      }),

    remove: protectedProcedure
      .input(z.object({ product: entityLinkSchema }))
      .mutation(async ({ input, ctx }) => {
        const cart = await getUserCart({ id: ctx.sessionData.userId });

        await database
          .delete(userCartProducts)
          .where(
            and(
              eq(userCartProducts.cartId, cart.id),
              eq(userCartProducts.productId, input.product.id)
            )
          );

        revalidatePath('/muj-ucet/kosik/pokladna');
      }),
  }),

  checkout: protectedProcedure
    .input(
      userCartCheckoutInputSchema.superRefine(async (value, ctx) => {
        const [paymentMethod, deliveryMethod] = await Promise.all([
          database.query.orderPaymentMethods.findFirst({
            where: eq(orderPaymentMethods.id, value.paymentMethod.id),
            with: {
              exceptDeliveryMethods: {
                with: {
                  deliveryMethod: true,
                },
              },
            },
          }),
          database.query.orderDeliveryMethods.findFirst({
            where: eq(orderDeliveryMethods.id, value.deliveryMethod.id),
          }),
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
          paymentMethod.exceptDeliveryMethods
            .map(({ deliveryMethod }) => deliveryMethod.id)
            .includes(value.deliveryMethod.id)
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
      const cart = await getUserCart({ id: ctx.sessionData.userId });

      if (!cart.products.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Žádné produkty v košíku',
        });
      }

      const [paymentMethod, deliveryMethod] = await Promise.all([
        database.query.orderPaymentMethods.findFirst({
          where: eq(orderPaymentMethods.id, input.paymentMethod.id),
          with: {
            exceptDeliveryMethods: {
              with: {
                deliveryMethod: true,
              },
            },
          },
        }),
        database.query.orderDeliveryMethods.findFirst({
          where: eq(orderDeliveryMethods.id, input.deliveryMethod.id),
        }),
      ]);

      if (!paymentMethod || !deliveryMethod) {
        throw new Error(
          'Either invalid payment method or delivery method has been selected for order, does schema work?'
        );
      }

      const { redirectTo, newOrderId } = await database.transaction(
        async (tx) => {
          let telephone = await tx.query.telephoneNumbers.findFirst({
            where: (schema, { eq }) =>
              eq(schema.telephone, input.telephoneNumber),
          });

          if (!telephone) {
            [telephone] = await tx
              .insert(telephoneNumbers)
              .values({
                telephone: input.telephoneNumber,
                code: '420',
              })
              .returning();
          }

          const [order] = await tx
            .insert(orders)
            .values({
              deliveryMethodId: input.deliveryMethod.id,
              email: input.email,
              telephoneId: telephone.id,
              firstName: input.firstName,
              lastName: input.lastName,
              notes: input.notes,
              paymentMethodId: input.paymentMethod.id,
              state: paymentMethod.paymentOnCheckout
                ? OrderState.UNPAID
                : OrderState.UNCONFIRMED,
              userId: ctx.sessionData.userId,
              paymentMethodPrice: paymentMethod.price,
              deliveryMethodPrice: deliveryMethod.price,
              subtotal: cart.subtotal,
            })
            .returning();

          const { municipality, ...addressPayload } = input.address;
          await tx.insert(orderAddresses).values({
            ...addressPayload,
            orderId: order.id,
            municipalityId: input.address.municipality.id,
          });

          // Update stock values
          const stockUpdatesAsPromises: Promise<any>[] = [];
          for (const productInCart of cart.products) {
            if (!productInCart.product.stock) {
              continue;
            }

            // TODO: doing this way will be imperfect if there will be more requests
            stockUpdatesAsPromises.push(
              database
                .update(productStock)
                .set({
                  value: Math.max(
                    0,
                    productInCart.product.stock.value - productInCart.count
                  ),
                })
                .where(eq(productStock.id, productInCart.product.stock.id))
            );
          }

          await Promise.all([
            // Paste products from cart to order
            tx.insert(orderedProducts).values(
              cart.products.map((productInCart) => ({
                count: productInCart.count,
                productId: productInCart.product.id,
                orderId: order.id,
                totalPrice:
                  productInCart.count *
                  (productInCart.product.price?.value ?? 0),
              }))
            ),
            tx.delete(userCartProducts).where(
              inArray(
                userCartProducts.id,
                cart.products.map(({ id }) => id)
              )
            ),
            // Include stock updates in one promise
            stockUpdatesAsPromises,
          ]);

          if (input.saveAddressToAccount) {
            await tx
              .update(userAddresses)
              .set({
                ...addressPayload,
                municipalityId: input.address.municipality.id,
              })
              .where(eq(userAddresses.userId, ctx.sessionData.user.id));
          }

          let redirectTo = `/muj-ucet/objednavky/${order.id}`;

          // Handle comgate payment as last thing
          if (paymentMethod.slug === PaymentMethodsSlug.BY_CARD) {
            const comgatePayment = await Comgate.createPayment({
              order,
            });

            await tx.insert(comgatePayments).values({
              transactionId: comgatePayment.data.transId!,
              orderId: order.id,
            });

            redirectTo = comgatePayment.data.redirect ?? redirectTo;
          }

          return { redirectTo, newOrderId: order.id };
        }
      );

      const order = await getOrderById(newOrderId);

      const [userEmailContent, adminEmailContent] = await Promise.all([
        renderAsync(
          ThankYouOrder({
            needsPayment: false,
            orderLink: `${config.app.origin}/muj-ucet/objednavky/${order.id}`,
            order: {
              ...order,
              deliveryMethod,
              paymentMethod,
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
        renderAsync(
          ThankYouOrderAdmin({
            orderLink: `${config.app.origin}/administrace/objednavky/${order.id}`,
            order,
            siteOrigin: config.app.origin,
          })
        ),
      ]);

      // Is it really necessary to wait here?
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

        MailService.send({
          // TODO: move this to configuration
          to: 'prodejnahk@najitnajist.cz',
          subject: `Nová objednávka #${order.id} na najitnajist.cz`,
          body: adminEmailContent,
        }).catch((error) => {
          logger.error(
            { error, order },
            `Order flow - could not notify admin to its email with order information`
          );
        }),
      ]);

      revalidatePath('/muj-ucet/kosik/pokladna');
      revalidatePath('/produkty');

      return {
        order,
        redirectTo,
      };
    }),
});
