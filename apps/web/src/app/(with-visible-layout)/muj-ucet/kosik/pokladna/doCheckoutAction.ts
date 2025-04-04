'use server';

import { comgateClient } from '@comgate-client';
import { APP_ORIGIN, ORDER_NOTIFICATION_EMAILS } from '@constants';
import { DEFAULT_TIMEZONE, dayjs } from '@dayjs';
import { ThankYouOrder, ThankYouOrderAdmin, render } from '@email';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq, sql } from '@najit-najist/database/drizzle';
import {
  Order,
  OrderDeliveryMethodsSlug,
  OrderPaymentMethodsSlugs,
  OrderState,
  comgatePayments,
  orderAddresses,
  orderLocalPickupTimes,
  orderedProducts,
  orders,
  packetaParcels,
  productStock,
  telephoneNumbers,
  userCarts,
} from '@najit-najist/database/models';
import { PacketaSoapClient } from '@najit-najist/packeta/soap-client';
import { MailService } from '@server/services/Mail.service';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { sendPlausibleEvent } from '@server/utils/sendPlausibleEvent';
import { getLoggedInUserId, getOrderById } from '@server/utils/server';
import { formatDeliveryMethodPrice } from '@utils/formatDeliveryMethodPrice';
import { getCartItemPrice } from '@utils/getCartItemPrice';
import { getPerfTracker } from '@utils/getPerfTracker';
import { getUserCart } from '@utils/getUserCart';
import { isCouponExpired } from '@utils/isCouponExpired';
import { orderCreateComgateRefId } from '@utils/orderCreateComgateRefId';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { FieldError } from 'react-hook-form';

import { checkoutCartSchemaServer } from './_internals/validateForm.server';

const sendEmails = (orderId: Order['id']) => {
  const perf = getPerfTracker();
  const getOrderPerf = perf.track('get-order');

  getOrderById(orderId).then(async (order) => {
    getOrderPerf.stop();

    const renderComponentsPerf = perf.track('render');
    const adminNoticeContents = ThankYouOrderAdmin({
      orderLink: new URL(
        `/administrace/objednavky/${order.id}`,
        APP_ORIGIN,
      ).toString(),
      order,
      siteOrigin: APP_ORIGIN,
    });
    const userNotice = ThankYouOrder({
      needsPayment: false,
      orderLink: new URL(
        `/muj-ucet/objednavky/${order.id}`,
        APP_ORIGIN,
      ).toString(),
      order: {
        ...order,
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
      siteOrigin: APP_ORIGIN,
    });
    renderComponentsPerf.stop();

    const renderHtmlPerf = perf.track('render-html');
    const [adminNoticeHtml, userNoticeHtml] = await Promise.all([
      render(adminNoticeContents),
      render(userNotice),
    ]);
    renderHtmlPerf.stop();

    const sendAdminPerf = perf.track('send-admin');
    await MailService.send({
      to: ORDER_NOTIFICATION_EMAILS,
      subject: `Nová objednávka #${order.id} na najitnajist.cz`,
      body: adminNoticeHtml,
      db: database,
    }).catch((error) => {
      logger.error(`[CHECKOUT] admin notification failed to be sent`, {
        error,
        order,
      });
    }),
      sendAdminPerf.stop();

    const sendUserPerf = perf.track('send-user');
    await MailService.send({
      to: order.email,
      subject: `Objednávka #${order.id} na najitnajist.cz`,
      body: userNoticeHtml,
      db: database,
    }).catch((error) => {
      logger.error(`[CHECKOUT] user notification failed to be sent`, {
        error,
        order,
      });
    });
    sendUserPerf.stop();

    logger.warn('[CHECKOUT] email duration', {
      duration: perf.summarize(),
    });
  });
};

const trackEvent = async (orderId: Order['id']) => {
  const perf = getPerfTracker();
  try {
    const orderPerf = perf.track('get-order');
    const order = await database.query.orders.findFirst({
      where: (s, { eq }) => eq(s.id, orderId),
      with: {
        address: {
          with: {
            municipality: true,
          },
        },
        deliveryMethod: true,
        paymentMethod: true,
        orderedProducts: {
          with: {
            product: true,
          },
        },
      },
    });
    orderPerf.stop();

    if (!order) {
      throw new Error('Order not found in database');
    }

    const mainEventPerf = perf.track('track-order');
    await sendPlausibleEvent('User order', {
      props: {
        municipality: order.address!.municipality.name,
        'delivery method': order.deliveryMethod.name,
        'payment method': order.paymentMethod.name,
      },
      revenue: {
        amount: orderGetTotalPrice(order),
        currency: 'CZK',
      },
    });
    mainEventPerf.stop();

    const productsEventPerf = perf.track('track-products');
    for (const productInCart of order.orderedProducts) {
      await sendPlausibleEvent('Product ordered', {
        props: {
          name: productInCart.product.name,
          count: String(productInCart.count),
        },
      });
    }
    productsEventPerf.stop();
    logger.warn('[CHECKOUT] tracking event finished', {
      duration: perf.summarize(),
    });
  } catch (error) {
    logger.error('[CHECKOUT] tracking event failed', {
      orderId,
      error,
      performance: perf.summarize(),
    });
  }
};

export const doCheckoutAction = createActionWithValidation(
  checkoutCartSchemaServer,
  async (input) => {
    let orderRedirectTo = '/';
    const perf = getPerfTracker();

    try {
      const userId = await getLoggedInUserId();
      const deliveryMethod = input.deliveryMethod.fetched!;
      const paymentMethod = input.paymentMethod!;

      const cartPerf = perf.track('get-cart');
      const cart = await getUserCart({ type: 'user', value: userId });
      cartPerf.stop();

      if (!cart) {
        throw new Error(
          'User has no cart during checkout, this is probably bug',
        );
      }

      if (!cart.products.length) {
        throw new Error('Žádné produkty v košíku');
      }

      if (
        cart.coupon &&
        (isCouponExpired(cart.coupon) || !cart.coupon?.enabled)
      ) {
        return {
          errors: {
            couponId: {
              type: 'validate',
              message: 'Vybraný kupón je již expirován',
            } satisfies FieldError,
          },
        };
      }

      const hasProductsWithLimitedDelivery = cart.products.some(
        ({ product }) => product.limitedToDeliveryMethods.length,
      );
      const methodSettings = new Map<OrderDeliveryMethodsSlug, number>();
      if (hasProductsWithLimitedDelivery) {
        let numberOfProductsThatMustBeSupported = 0;

        for (const { product } of cart.products) {
          if (!product.limitedToDeliveryMethods.length) {
            continue;
          }

          numberOfProductsThatMustBeSupported += 1;

          for (const {
            deliveryMethod: { slug },
          } of product.limitedToDeliveryMethods) {
            methodSettings.set(slug, (methodSettings.get(slug) ?? 0) + 1);
          }
        }

        if (
          methodSettings.get(input.deliveryMethod.fetched!.slug) !==
          numberOfProductsThatMustBeSupported
        ) {
          return {
            errors: {
              deliveryMethod: {
                type: 'validate',
                message:
                  'Vámi vybraná doprava není podporována všemi produkty. Prosím vyberte jinou nebo nás kontaktujte.',
              } satisfies FieldError,
            },
          };
        }
      }

      // if (process.env.NODE_ENV === 'development') {
      //   return {
      //     errors: {
      //       root: {
      //         type: 'validate',
      //         message: 'Pouze vývoj!',
      //       } satisfies FieldError,
      //     },
      //   };
      // }

      const createOrderPerf = perf.track('create-order-all');
      const newOrderId = await database.transaction(async (tx) => {
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

        // Update stock values
        const [orderAddress] = await tx
          .insert(orderAddresses)
          .values({
            ...input.address,
            municipalityId: input.address.municipality.id,
          })
          .returning();

        const [invoiceAddress] = input.invoiceAddress
          ? await tx
              .insert(orderAddresses)
              .values({
                ...input.invoiceAddress,
                municipalityId: input.invoiceAddress.municipality.id,
              })
              .returning()
          : [];

        const [order] = await tx
          .insert(orders)
          .values({
            deliveryMethodId: deliveryMethod.id,
            email: input.email,
            telephoneId: telephone.id,
            firstName: input.firstName,
            lastName: input.lastName,
            notes: input.notes,
            paymentMethodId: paymentMethod.id,
            state: paymentMethod.paymentOnCheckout
              ? OrderState.UNPAID
              : OrderState.UNCONFIRMED,
            userId: userId,
            paymentMethodPrice: paymentMethod.price,
            deliveryMethodPrice: formatDeliveryMethodPrice(
              deliveryMethod.price ?? 0,
              cart,
            ).formatted,
            invoiceAddressId: invoiceAddress?.id,
            ico: input.businessInformations?.ico,
            dic: input.businessInformations?.dic,
            addressId: orderAddress.id,
            subtotal: cart.subtotal,
            discount: cart.discount,
            // Only assign discount when user is actually eligible
            couponPatchId: cart.discount ? cart.coupon?.patches[0].id : null,
          })
          .returning();

        for (const productInCart of cart.products) {
          if (!productInCart.product.stock) {
            continue;
          }

          await database
            .update(productStock)
            .set({
              value: sql<number>`GREATEST(${productStock.value} - ${productInCart.count}, 0)`,
            })
            .where(eq(productStock.id, productInCart.product.stock.id));
        }

        await tx.insert(orderedProducts).values(
          cart.products.map((productInCart) => {
            const { value: totalPrice, discount } = getCartItemPrice(
              productInCart,
              cart.coupon ?? undefined,
            );

            return {
              count: productInCart.count,
              productId: productInCart.product.id,
              orderId: order.id,
              totalPrice,
              discount,
            };
          }),
        );

        await tx.delete(userCarts).where(eq(userCarts.id, cart.id));

        let redirectTo = `/muj-ucet/objednavky/${order.id}`;

        // Handle comgate payment as last thing
        if (paymentMethod.slug === OrderPaymentMethodsSlugs.BY_CARD) {
          const comgatePerf = perf.track('contact-comgate');
          const comgatePayment = await comgateClient.createPayment({
            amount: orderGetTotalPrice(order),
            email: order.email,
            refId: orderCreateComgateRefId(order),
          });
          comgatePerf.stop();

          await tx.insert(comgatePayments).values({
            redirectUrl: comgatePayment.data.redirect,
            transactionId: comgatePayment.data.transId!,
            orderId: order.id,
          });

          redirectTo = comgatePayment.data.redirect ?? redirectTo;
        }

        if (
          input.deliveryMethod.original.slug ===
          OrderDeliveryMethodsSlug.PACKETA
        ) {
          const packetaMeta = input.deliveryMethod.original.meta;
          const packetaPerf = perf.track('contact-packeta');

          const packet = await PacketaSoapClient.createPacket({
            number: String(order.id),
            name: input.firstName,
            surname: input.lastName,
            email: input.email,
            phone: `+${telephone.code}${telephone.telephone}`,
            addressId: packetaMeta.id,
            // TODO: this should be calculated from items
            weight: 1,
            value:
              order.subtotal - order.discount + (order.paymentMethodPrice ?? 0),
            ...(input.paymentMethod!.slug === OrderPaymentMethodsSlugs.COD
              ? {
                  cod: orderGetTotalPrice(order),
                }
              : {}),
          });
          packetaPerf.stop();

          await tx.insert(packetaParcels).values({
            addressId: packetaMeta.id,
            addressType: packetaMeta.pickupPointType,
            packetBarcodePretty: packet.barcodeText,
            packetBarcodeRaw: packet.barcode,
            packetId: Number(packet.id),
            orderId: order.id,
          });
        } else if (
          input.deliveryMethod.original.slug ===
          OrderDeliveryMethodsSlug.LOCAL_PICKUP
        ) {
          await tx.insert(orderLocalPickupTimes).values({
            orderId: order.id,
            date: dayjs(input.deliveryMethod.original.meta)
              .tz(DEFAULT_TIMEZONE, true)
              .toDate(),
          });
        }

        orderRedirectTo = redirectTo;

        return order.id;
      });
      createOrderPerf.stop();

      if (process.env.NODE_ENV !== 'development') {
        sendEmails(newOrderId);
        trackEvent(newOrderId);
      }

      revalidatePath('/muj-ucet/kosik');
      revalidatePath('/produkty');
      revalidatePath('/muj-ucet/objednavky');
      revalidatePath('/administrace/objednavky');

      logger.warn('[CHECKOUT] duration', {
        duration: perf.summarize(),
      });
    } catch (error) {
      logger.error('Failed to create order', {
        error,
        performance: perf.summarize(),
      });
      throw error;
    }

    redirect(orderRedirectTo);
    return undefined;
  },
);
