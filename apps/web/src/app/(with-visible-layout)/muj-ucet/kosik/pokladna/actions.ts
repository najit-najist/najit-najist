'use server';

import { DEFAULT_TIMEZONE, dayjs } from '@najit-najist/api';
import {
  Comgate,
  MailService,
  config,
  getLoggedInUserId,
  getOrderById,
  logger,
} from '@najit-najist/api/server';
import { database } from '@najit-najist/database';
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
  userAddresses,
  userCartProducts,
} from '@najit-najist/database/models';
import {
  ThankYouOrder,
  ThankYouOrderAdmin,
  renderAsync,
} from '@najit-najist/email-templates';
import { PacketaSoapClient } from '@najit-najist/packeta/soap-client';
import { sendPlausibleEvent } from '@server/utils/sendPlausibleEvent';
import { getTotalPrice } from '@utils';
import { getPerfTracker } from '@utils/getPerfTracker';
import { getUserCart } from '@utils/getUserCart';
import { zodErrorToFormErrors } from '@utils/zodErrorToFormErrors';
import { eq, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getPaymentAndDelivery } from './_internals/getPaymentAndDelivery.server';
import { FormValues } from './_internals/types';
import { validateForm } from './_internals/validateForm.server';

const sendEmails = (orderId: Order['id']) => {
  const perf = getPerfTracker();
  const getOrderPerf = perf.track('get-order');

  getOrderById(orderId).then(async (order) => {
    getOrderPerf.stop();

    const renderComponentsPerf = perf.track('render');
    const adminNoticeContents = ThankYouOrderAdmin({
      orderLink: `${config.app.origin}/administrace/objednavky/${order.id}`,
      order,
      siteOrigin: config.app.origin,
    });
    const userNotice = ThankYouOrder({
      needsPayment: false,
      orderLink: `${config.app.origin}/muj-ucet/objednavky/${order.id}`,
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
      siteOrigin: config.app.origin,
    });
    renderComponentsPerf.stop();

    const renderHtmlPerf = perf.track('render-html');
    const [adminNoticeHtml, userNoticeHtml] = await Promise.all([
      renderAsync(adminNoticeContents),
      renderAsync(userNotice),
    ]);
    renderHtmlPerf.stop();

    const sendAdminPerf = perf.track('send-admin');
    await Promise.all([
      MailService.send({
        to: config.mail.baseEmail,
        subject: `Nová objednávka #${order.id} na najitnajist.cz`,
        body: adminNoticeHtml,
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
        body: adminNoticeHtml,
      }).catch((error) => {
        logger.error(
          { error, order },
          `Order flow - could not notify admin to its email with order information`
        );
      }),
    ]);
    sendAdminPerf.stop();

    const sendUserPerf = perf.track('send-user');
    await MailService.send({
      to: order.email,
      subject: `Objednávka #${order.id} na najitnajist.cz`,
      body: userNoticeHtml,
    }).catch((error) => {
      logger.error(
        { error, order },
        `Order flow - could not notify user to its email with order information`
      );
    });
    sendUserPerf.stop();

    logger.warn(perf.summarize(), 'Order email');
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
        amount: getTotalPrice(order),
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
    logger.warn(perf.summarize(), 'Order event duration summarize');
  } catch (error) {
    logger.error(
      { orderId, error, performance: perf.summarize() },
      'Failed to track event for new order'
    );
  }
};

export async function doCheckoutAction(
  formValues: Partial<FormValues> | undefined = {}
) {
  let orderRedirectTo = '/';
  const perf = getPerfTracker();

  try {
    const userId = await getLoggedInUserId();

    const validationPerf = perf.track('validation');
    const paymentAndDeliveryMethod = await getPaymentAndDelivery(formValues);
    const validatedInput = await validateForm(
      formValues,
      paymentAndDeliveryMethod
    );
    validationPerf.stop();

    if (!validatedInput.success) {
      logger.warn(perf.summarize(), 'Order duration - premature stop');

      return {
        errors: zodErrorToFormErrors(validatedInput.error.errors, true),
      };
    }
    const deliveryMethod = paymentAndDeliveryMethod.deliveryMethod!;
    const paymentMethod = paymentAndDeliveryMethod.paymentMethod!;
    const { data: input } = validatedInput;

    const cartPerf = perf.track('get-cart');
    const cart = await getUserCart({ id: userId });
    cartPerf.stop();

    if (!cart.products.length) {
      throw new Error('Žádné produkty v košíku');
    }

    const createOrderPerf = perf.track('create-order-all');
    const newOrderId = await database.transaction(async (tx) => {
      let telephone = await tx.query.telephoneNumbers.findFirst({
        where: (schema, { eq }) => eq(schema.telephone, input.telephoneNumber),
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
          deliveryMethodPrice: deliveryMethod.price,
          subtotal: cart.subtotal,
        })
        .returning();

      const { municipality, ...addressPayload } = input.address;

      // Update stock values
      await tx.insert(orderAddresses).values({
        ...addressPayload,
        orderId: order.id,
        municipalityId: input.address.municipality.id,
      });

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

      if (input.saveAddressToAccount) {
        await tx
          .update(userAddresses)
          .set({
            ...addressPayload,
            municipalityId: input.address.municipality.id,
          })
          .where(eq(userAddresses.userId, userId));
      }

      await tx.insert(orderedProducts).values(
        cart.products.map((productInCart) => ({
          count: productInCart.count,
          productId: productInCart.product.id,
          orderId: order.id,
          totalPrice:
            productInCart.count * (productInCart.product.price?.value ?? 0),
        }))
      );

      await tx.delete(userCartProducts).where(
        inArray(
          userCartProducts.id,
          cart.products.map(({ id }) => id)
        )
      );

      let redirectTo = `/muj-ucet/objednavky/${order.id}`;

      // Handle comgate payment as last thing
      if (paymentMethod.slug === OrderPaymentMethodsSlugs.BY_CARD) {
        const comgatePerf = perf.track('contact-comgate');
        const comgatePayment = await Comgate.createPayment({
          order,
        });
        comgatePerf.stop();

        await tx.insert(comgatePayments).values({
          redirectUrl: comgatePayment.data.redirect,
          transactionId: comgatePayment.data.transId!,
          orderId: order.id,
        });

        redirectTo = comgatePayment.data.redirect ?? redirectTo;
      }

      if (input.deliveryMethod.slug === OrderDeliveryMethodsSlug.PACKETA) {
        const packetaMeta = input.deliveryMethod.meta;
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
          value: order.subtotal,
          ...(input.paymentMethod.slug === OrderPaymentMethodsSlugs.COD
            ? {
                cod: getTotalPrice(order),
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
        input.deliveryMethod.slug === OrderDeliveryMethodsSlug.LOCAL_PICKUP
      ) {
        await tx.insert(orderLocalPickupTimes).values({
          orderId: order.id,
          date: dayjs(input.deliveryMethod.meta)
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

    revalidatePath('/muj-ucet/kosik/pokladna');
    revalidatePath('/produkty');
    revalidatePath('/muj-ucet/objednavky');
    revalidatePath('/administrace/objednavky');

    logger.warn(perf.summarize(), 'Order duration');
  } catch (error) {
    logger.error(
      { error, performance: perf.summarize() },
      'Failed to create order'
    );
    throw error;
  }

  redirect(orderRedirectTo);
  return undefined;
}
