import { DEFAULT_DATE_FORMAT } from '@constants';
import { dayjs } from '@dayjs';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import { Order, OrderState } from '@najit-najist/database/models';
import { Alert } from '@najit-najist/ui';
import { FC } from 'react';

import type { OrderUnderpageViewType } from './OrderUnderpageContent';
import { getCachedDeliveryMethod } from './getCachedDeliveryMethod';
import { getCachedLocalPickupDate } from './getCachedLocalPickupDate';

export const SectionShipmentPayment: FC<{
  order: Order;
  viewType: OrderUnderpageViewType;
}> = async ({ order }) => {
  const [paymentMethod, deliveryMethod, localPickupDate] = await Promise.all([
    database.query.orderPaymentMethods.findFirst({
      where: (s, { eq }) => eq(s.id, order.paymentMethodId),
    }),
    getCachedDeliveryMethod(order.deliveryMethodId),
    getCachedLocalPickupDate(order.id),
  ]);

  return (
    <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
      <div>
        <dt className="font-semibold text-project-secondary">
          Platební metoda
        </dt>
        <dd className="mt-2 text-gray-700">
          <p>{paymentMethod?.name}</p>
          {order.state === 'unpaid' && paymentMethod?.notes ? (
            <Alert
              color="warning"
              heading={
                <>
                  <ExclamationTriangleIcon className="w-4 h-4 inline" />{' '}
                  Důležitá informace
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
      <div>
        <dt className="font-semibold text-project-secondary">
          Doručovací metoda
        </dt>
        <dd className="mt-2 text-gray-700">
          {deliveryMethod ? (
            <>
              <p>
                {deliveryMethod.name}
                {localPickupDate ? (
                  <>
                    {' '}
                    v{' '}
                    <strong>
                      {dayjs
                        .tz(localPickupDate.date)
                        .format(DEFAULT_DATE_FORMAT)}
                    </strong>
                  </>
                ) : null}
              </p>
              <p className="mt-1">{deliveryMethod.description}</p>
            </>
          ) : (
            <p>Neznámá doručovací metoda</p>
          )}
        </dd>
      </div>
    </dl>
  );
};
