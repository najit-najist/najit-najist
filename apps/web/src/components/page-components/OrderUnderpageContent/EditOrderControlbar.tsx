import { DEFAULT_DATE_FORMAT } from '@constants';
import { ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { DEFAULT_TIMEZONE, dayjs } from '@najit-najist/api';
import { database } from '@najit-najist/database';
import { Order, OrderState } from '@najit-najist/database/models';
import { Alert, Label, Paper } from '@najit-najist/ui';
import { isLocalPickup } from '@utils';
import clsx from 'clsx';
import { FC } from 'react';

import {
  ActiveButtonConfig,
  EditOrderStateButtons,
} from './EditOrderStateButtons';
import { OrderUnderpageProps } from './OrderUnderpageContent';
import { getCachedDeliveryMethod } from './getCachedDeliveryMethod';
import { getCachedLocalPickupDate } from './getCachedLocalPickupDate';

export const EditOrderControllbar: FC<
  OrderUnderpageProps & { order: Order }
> = async ({ order }) => {
  const [deliveryMethod, localPickupDate] = await Promise.all([
    getCachedDeliveryMethod(order.deliveryMethodId),
    getCachedLocalPickupDate(order.id),
  ]);
  const isOrderLocalPickup = deliveryMethod
    ? isLocalPickup(deliveryMethod)
    : false;

  const orderStateToButtons: Record<OrderState, ActiveButtonConfig[]> = {
    new: [
      {
        nextState: OrderState.CONFIRMED,
        text: 'Označit jako potvrzeno',
      },
    ],
    unpaid: [
      {
        nextState: OrderState.UNCONFIRMED,
        text: 'Označit jako nepotvrzeno',
      },
      {
        nextState: OrderState.CONFIRMED,
        text: 'Označit jako potvrzeno',
      },
    ],
    unconfirmed: [
      {
        nextState: OrderState.CONFIRMED,
        text: 'Označit jako potvrzeno',
      },
    ],
    confirmed: [
      {
        nextState: OrderState.SHIPPED,
        text: isOrderLocalPickup
          ? 'Označit jako připraveno k vyzvednutí'
          : 'Označit jako odesláno',
      },
    ],
    dropped: [],
    finished: [],
    shipped: [
      {
        nextState: OrderState.FINISHED,
        text: 'Označit jako dokončeno',
      },
    ],
  };

  const activeButtons = orderStateToButtons[order.state];
  const orderIsFinished = order.state === 'finished';
  const orderIsDropped = order.state === 'dropped';
  const pickupDateAsDayjs = localPickupDate?.date
    ? dayjs.tz(localPickupDate?.date)
    : null;

  return (
    <Paper className="px-3 py-2 divide-y-2">
      <p className="font-title text-lg pb-2">Upravit</p>

      <div
        className={clsx(
          orderIsFinished || orderIsDropped ? 'opacity-50' : '',
          'pt-3'
        )}
      >
        <Label>Změna stavu objednávky</Label>

        {orderIsFinished || orderIsDropped ? (
          <Alert
            className="mt-2"
            heading={
              <>
                <InformationCircleIcon className="w-4 h-4 inline mr-2" />
                {orderIsFinished
                  ? 'Objednávka byla dokončena'
                  : 'Objednávka byla zrušena'}
              </>
            }
          ></Alert>
        ) : (
          <>
            <EditOrderStateButtons
              buttons={activeButtons}
              order={{ id: order.id }}
            />

            {pickupDateAsDayjs ? (
              <>
                <hr className="border-none bg-gray-100 h-0.5 my-3" />
                <Alert
                  color="warning"
                  icon={ClockIcon}
                  heading={
                    Math.min(1, pickupDateAsDayjs.diff(dayjs.tz(), 'minutes')) <
                    1
                      ? `Osobní odběr byl ${pickupDateAsDayjs.format(
                          DEFAULT_DATE_FORMAT
                        )}`
                      : `Osobní odběr je ${pickupDateAsDayjs.format(
                          DEFAULT_DATE_FORMAT
                        )}`
                  }
                ></Alert>
              </>
            ) : null}
          </>
        )}
      </div>
    </Paper>
  );
};
