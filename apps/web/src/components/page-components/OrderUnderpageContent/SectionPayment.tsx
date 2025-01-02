import { Alert } from '@components/common/Alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import { Order, OrderState } from '@najit-najist/database/models';
import { FC } from 'react';

import type { OrderUnderpageViewType } from './OrderUnderpageContent';

export const SectionPayment: FC<{
  order: Order;
  viewType: OrderUnderpageViewType;
}> = async ({ order }) => {
  const paymentMethod = await database.query.orderPaymentMethods.findFirst({
    where: (s, { eq }) => eq(s.id, order.paymentMethodId),
  });

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
        {order.state !== OrderState.UNPAID &&
        paymentMethod?.slug === 'comgate' ? (
          <Alert color="success" heading="🤗 Zaplaceno">
            Děkujeme za provedení platby přes COMGATE.
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
