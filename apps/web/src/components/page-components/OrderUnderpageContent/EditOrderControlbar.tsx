import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Order } from '@najit-najist/api';
import { Alert, Label, Paper } from '@najit-najist/ui';
import { isLocalPickup } from '@utils';
import clsx from 'clsx';
import { FC } from 'react';

import {
  ActiveButtonConfig,
  EditOrderStateButtons,
} from './EditOrderStateButtons';
import { OrderUnderpageProps } from './OrderUnderpageContent';

type OrderState = Order['state'];

export const EditOrderControllbar: FC<OrderUnderpageProps> = ({ order }) => {
  const isOrderLocalPickup = isLocalPickup(order.delivery_method);

  const orderStateToButtons: Record<OrderState, ActiveButtonConfig[]> = {
    new: [],
    unpaid: [
      {
        nextState: 'unconfirmed',
        text: 'Označit jako nepotvrzeno',
      },
      {
        nextState: 'confirmed',
        text: 'Označit jako potvrzeno',
      },
    ],
    unconfirmed: [
      {
        nextState: 'confirmed',
        text: 'Označit jako potvrzeno',
      },
    ],
    confirmed: [
      {
        nextState: 'shipped',
        text: isOrderLocalPickup
          ? 'Označit jako připraveno k vyzvednutí'
          : 'Označit jako odesláno',
      },
    ],
    dropped: [],
    finished: [],
    shipped: [
      {
        nextState: 'finished',
        text: 'Označit jako dokončeno',
      },
    ],
  };

  const activeButtons = orderStateToButtons[order.state];
  const orderIsFinished = order.state === 'finished';
  const orderIsDropped = order.state === 'dropped';

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
                <InformationCircleIcon className=" w-4 h-4 inline mr-2" />
                {orderIsFinished
                  ? 'Objednávka byla dokončena'
                  : 'Objednávka byla zrušena'}
              </>
            }
          ></Alert>
        ) : (
          <EditOrderStateButtons
            buttons={activeButtons}
            order={{ id: order.id }}
          />
        )}
      </div>
    </Paper>
  );
};
