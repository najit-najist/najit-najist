import { comgateClient } from '@comgate-client';
import { Alert } from '@components/common/Alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import {
  Order,
  OrderPaymentMethodsSlugs,
  OrderState,
} from '@najit-najist/database/models';
import { FC } from 'react';

import type { OrderUnderpageViewType } from './OrderUnderpageContent';

export const SectionPayment: FC<{
  order: Order;
  viewType: OrderUnderpageViewType;
}> = async ({ order }) => {
  const paymentMethod = await database.query.orderPaymentMethods.findFirst({
    where: (s, { eq }) => eq(s.id, order.paymentMethodId),
  });

  const comgatePayment =
    paymentMethod?.slug === OrderPaymentMethodsSlugs.BY_CARD
      ? await database.query.comgatePayments
          .findFirst({
            where: (s, { eq }) => eq(s.orderId, order.id),
          })
          .then((payment) =>
            payment
              ? comgateClient
                  .getStatus({ transId: payment?.transactionId })
                  .then(
                    ({ data }) =>
                      data as unknown as {
                        status: 'PENDING' | 'PAID' | 'CANCELLED' | 'AUTHORIZED';
                      },
                  )
              : null,
          )
      : null;

  // if (packetaPackage) {
  //   console.log({ packetaPackage });

  //   packetaPackage.addressType === PacketaPickupPointType.INTERNAL
  //   console.log(
  //     await PacketaSoapClient.getPacketStatus(packetaPackage.packetId),
  //   );
  // }

  return (
    <div className="text-sm">
      <dt className="font-semibold text-project-secondary">Platební metoda</dt>
      <dd className="mt-2 text-gray-700">
        <p>{paymentMethod?.name}</p>
        {order.state === 'unpaid' && paymentMethod?.notes ? (
          <Alert
            color="warning"
            heading={
              <>
                <ExclamationTriangleIcon className="w-4 h-4 inline" /> Důležitá
                informace
              </>
            }
            className="mt-3"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: paymentMethod.notes,
              }}
            ></div>
          </Alert>
        ) : null}
        {comgatePayment?.status.toLowerCase() === 'paid' ||
        comgatePayment?.status.toLowerCase() === 'authorized' ? (
          <Alert color="success" heading="🤗 Zaplaceno">
            Děkujeme za provedení platby přes COMGATE.
          </Alert>
        ) : null}
        {comgatePayment?.status.toLowerCase() === 'cancelled' ? (
          <Alert color="warning" heading="🥲 Zrušeno">
            Nákup byl při platbě zrušen.
          </Alert>
        ) : null}
        {comgatePayment?.status.toLowerCase() === 'pending' ? (
          <Alert color="warning" heading="🤔 Čekáme na dokončení">
            Platba byla založena, ale nebyla dokočena.
          </Alert>
        ) : null}
        {/* <p>Mastercard</p>
      <p>
        <span aria-hidden="true">••••</span>
        <span className="sr-only">Ending in </span>1545
      </p> */}
      </dd>
    </div>
  );
};
