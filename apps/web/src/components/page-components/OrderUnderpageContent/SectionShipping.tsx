import { DEFAULT_DATE_FORMAT } from '@constants';
import { dayjs } from '@dayjs';
import { Order } from '@najit-najist/database/models';
import { FC } from 'react';

import { getCachedDeliveryMethod } from './getCachedDeliveryMethod';
import { getCachedLocalPickupDate } from './getCachedLocalPickupDate';

export const SectionShipping: FC<{ order: Order }> = async ({ order }) => {
  const [deliveryMethod, localPickupDate] = await Promise.all([
    getCachedDeliveryMethod(order.deliveryMethodId),
    getCachedLocalPickupDate(order.id),
  ]);

  return (
    <dl className="text-sm">
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
                    {dayjs.tz(localPickupDate.date).format(DEFAULT_DATE_FORMAT)}
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
    </dl>
  );
};
