'use server';

import { APP_ORIGIN } from '@constants';
import { OrderConfirmed, OrderShipped, render } from '@email';
import { logger } from '@logger/server';
import { ComgateResponseCode } from '@najit-najist/comgate';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import {
  OrderDeliveryMethodsSlug,
  OrderPaymentMethodsSlugs,
  OrderState,
  orders,
} from '@najit-najist/database/models';
import { PacketaSoapClient } from '@najit-najist/packeta/soap-client';
import { entityLinkSchema } from '@najit-najist/schemas';
import { MailService } from '@server/services/Mail.service';
import { getOrderById } from '@server/utils/server';
import { isLocalPickup } from '@utils';
import { getPerfTracker } from '@utils/getPerfTracker';
import { orderGetComgateRefId } from '@utils/orderGetComgateRefId';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
import { comgateClient } from 'comgateClient';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const inputValidation = entityLinkSchema.extend({
  payload: z.object({ state: z.nativeEnum(OrderState) }),
});

export type UpdateOrderActionOption = z.input<typeof inputValidation>;

type OrderWithRelations = Awaited<ReturnType<typeof getOrderById>>;
type OrderStateListener = (order: OrderWithRelations) => Promise<void>;

class FailedRefundError extends Error {
  readonly meta: object;
  constructor(meta: object) {
    super('Failed to do a refund, please do it manually!');
    this.name = 'FailedRefundError';
    this.meta = meta;
  }
}

const onOrderConfirmed: OrderStateListener = async (
  order: OrderWithRelations,
) => {
  await MailService.send({
    to: order.email,
    subject: `Objednávka #${order.id} potvrzena`,
    body: await render(
      OrderConfirmed({
        orderLink: new URL(
          `/muj-ucet/objednavky/${order.id}`,
          APP_ORIGIN,
        ).toString(),
        order,
        siteOrigin: APP_ORIGIN,
      }),
    ),
    db: database,
  });
};
const onOrderShipped: OrderStateListener = async (
  order: OrderWithRelations,
) => {
  await MailService.send({
    to: order.email,
    subject: `Objednávka #${order.id} ${
      isLocalPickup(order.deliveryMethod) ? 'připravena' : 'odeslána'
    }`,
    body: await render(
      OrderShipped({
        orderLink: new URL(
          `/muj-ucet/objednavky/${order.id}`,
          APP_ORIGIN,
        ).toString(),
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
        siteOrigin: APP_ORIGIN,
      }),
    ),
    db: database,
  });
};
const onOrderDropped: OrderStateListener = async (order) => {
  if (order.deliveryMethod.slug === OrderDeliveryMethodsSlug.PACKETA) {
    const packetaParcel = await database.query.packetaParcels.findFirst({
      where: (s, { eq }) => eq(s.orderId, order.id),
    });

    if (packetaParcel) {
      await PacketaSoapClient.cancelPacket(packetaParcel?.packetId);
    } else {
      logger.warn(
        '[ORDER] Could not find packeta parcel for dropped order event',
        { order },
      );
    }
  }

  if (order.paymentMethod.slug === OrderPaymentMethodsSlugs.BY_CARD) {
    const comgatePayment = await database.query.comgatePayments.findFirst({
      where: (s, { eq }) => eq(s.orderId, order.id),
    });

    if (comgatePayment) {
      const paymentCancelResponse = await comgateClient.cancelPayment(
        comgatePayment.transactionId,
      );

      if (paymentCancelResponse.data.code !== ComgateResponseCode.OK) {
        logger.warn('[ORDER] Could not cancel payment, we will try to refund', {
          order,
          resp: paymentCancelResponse.data,
        });

        const { comgatePayment: orderComgatePayment } = order;

        if (!orderComgatePayment) {
          throw new Error(
            'Could not find comgate payment in database for order',
          );
        }

        const paymentRefundResponse = await comgateClient.refundPayment(
          orderGetComgateRefId({
            ...order,
            comgatePayment: orderComgatePayment,
          }),
          orderGetTotalPrice(order),
        );

        if (paymentRefundResponse.data.code !== ComgateResponseCode.OK) {
          throw new FailedRefundError({
            order,
            resp: paymentRefundResponse.data,
          });
        }
      }
    } else {
      logger.error(
        '[ORDER] Could not find comgate payment for dropped order event',
        {
          order,
        },
      );
    }
  }
};

const listeners: Partial<
  Record<OrderWithRelations['state'], OrderStateListener>
> = {
  confirmed: onOrderConfirmed,
  shipped: onOrderShipped,
  dropped: onOrderDropped,
};

export async function updateOrderAction(options: UpdateOrderActionOption) {
  const input = await inputValidation.parseAsync(options);

  const order = await getOrderById(input.id);

  if (!order) {
    notFound();
  }

  await database
    .update(orders)
    .set(input.payload)
    .where(eq(orders.id, order.id));

  const newState = input.payload.state;
  if (newState) {
    const methodForNewState = listeners[newState];

    if (methodForNewState) {
      const perf = getPerfTracker();
      await methodForNewState(order)
        .catch((error) => {
          logger.error(
            `[ORDER] Order flow ${newState} - could not finish listener due to some errors`,
            { error, order },
          );
        })
        .finally(() => {
          logger.warn('[ORDER] Perf of order state hooks', {
            perf: perf.summarize(),
            newState,
          });
        });
    }
  }

  revalidatePath('/produkty');
  revalidatePath('/muj-ucet/objednavky');
  revalidatePath(`/muj-ucet/objednavky/${order.id}`);
  revalidatePath('/administrace/objednavky');
  revalidatePath(`/administrace/objednavky/${order.id}`);
}
