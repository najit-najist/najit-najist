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
  OrderState,
  comgatePayments,
  orderAddresses,
  orderDeliveryMethods,
  orderLocalPickupTimes,
  orderPaymentMethods,
  orderedProducts,
  orders,
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
import {
  pickupTimeSchema,
  userCartCheckoutInputSchema,
} from '@najit-najist/schemas';
import { getTotalPrice, isLocalPickup } from '@utils';
import { getPerfTracker } from '@utils/getPerfTracker';
import { getUserCart } from '@utils/getUserCart';
import { zodErrorToFormErrors } from '@utils/zodErrorToFormErrors';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { FormValues } from './_internals/types';

const getPaymentAndDelivery = async ({
  deliveryMethod: pickedDeliveryMethod,
  paymentMethod: pickedPaymentMethod,
}: Pick<Partial<FormValues>, 'paymentMethod' | 'deliveryMethod'>) => {
  if (!pickedDeliveryMethod?.id || !pickedPaymentMethod?.id) {
    return {};
  }

  const [paymentMethod, deliveryMethod] = await Promise.all([
    database.query.orderPaymentMethods.findFirst({
      where: eq(orderPaymentMethods.id, pickedPaymentMethod.id),
      with: {
        exceptDeliveryMethods: {
          with: {
            deliveryMethod: true,
          },
        },
      },
    }),
    database.query.orderDeliveryMethods.findFirst({
      where: eq(orderDeliveryMethods.id, pickedDeliveryMethod.id),
    }),
  ]);

  return { paymentMethod, deliveryMethod };
};

type GetPaymentAndDeliveryReturn = Awaited<
  ReturnType<typeof getPaymentAndDelivery>
>;

enum PaymentMethodsSlug {
  BY_CARD = 'comgate',
  BY_WIRE = 'wire',
  PREPAY_BY_WIRE = 'prepay_wire',
  ON_PLACE = 'on_place',
}

const validateInput = (formData: unknown, meta: GetPaymentAndDeliveryReturn) =>
  userCartCheckoutInputSchema
    .superRefine(async (value, ctx) => {
      const { deliveryMethod, paymentMethod } = meta;

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
          .map(
            ({ deliveryMethod: exceptDeliveryMethod }) =>
              exceptDeliveryMethod.id
          )
          .includes(value.deliveryMethod.id)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vybraný způsob dopravy neznáme, vyberte jinou',
          fatal: true,
          path: ['deliveryMethod.id'],
        });
      }

      if (deliveryMethod && isLocalPickup(deliveryMethod)) {
        const validatedPickupDate = pickupTimeSchema.safeParse(
          value.localPickupTime
        );

        if (!validatedPickupDate.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: validatedPickupDate.error.format()._errors.join(', '),
            fatal: true,
            path: ['localPickupTime'],
          });
        }
      }
    })
    .safeParseAsync(formData);

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

const sendPlausibleEvent = (
  eventName: string,
  payload: { props?: object; revenue?: object }
) =>
  fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain: 'najitnajist.cz',
      name: eventName,
      referrer: 'https://najitnajist.cz/muj-ucet/kosik/pokladna',
      url: 'https://najitnajist.cz/muj-ucet/kosik/pokladna',
      ...payload,
    }),
  });

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
    const validatedInput = await validateInput(
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
          userId: userId,
          paymentMethodPrice: paymentMethod.price,
          deliveryMethodPrice: deliveryMethod.price,
          subtotal: cart.subtotal,
        })
        .returning();

      const { municipality, ...addressPayload } = input.address;

      // Update stock values
      const stockUpdatesAsPromises: Promise<any>[] = [
        tx.insert(orderAddresses).values({
          ...addressPayload,
          orderId: order.id,
          municipalityId: input.address.municipality.id,
        }),
      ];

      if (input.localPickupTime) {
        stockUpdatesAsPromises.push(
          tx.insert(orderLocalPickupTimes).values({
            orderId: order.id,
            date: dayjs(input.localPickupTime)
              .tz(DEFAULT_TIMEZONE, true)
              .toDate(),
          })
        );
      }

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
              productInCart.count * (productInCart.product.price?.value ?? 0),
          }))
        ),
        tx.delete(userCartProducts).where(
          inArray(
            userCartProducts.id,
            cart.products.map(({ id }) => id)
          )
        ),
        // Include stock updates in one promise
        ...stockUpdatesAsPromises,
      ]);

      if (input.saveAddressToAccount) {
        await tx
          .update(userAddresses)
          .set({
            ...addressPayload,
            municipalityId: input.address.municipality.id,
          })
          .where(eq(userAddresses.userId, userId));
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
}
