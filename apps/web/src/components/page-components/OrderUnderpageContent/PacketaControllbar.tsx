import { DEFAULT_DATE_FORMAT } from '@constants';
import { database } from '@najit-najist/database';
import { Order } from '@najit-najist/database/models';
import { PacketaSoapClient } from '@najit-najist/packeta/soap-client';
import { Paper } from '@najit-najist/ui';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FC } from 'react';

export const PacketaControlbar: FC<{ order: Order }> = async ({ order }) => {
  const parcel = await database.query.packetaParcels.findFirst({
    where: (s, { eq }) => eq(s.orderId, order.id),
  });

  if (!parcel) {
    return null;
  }

  const result = await PacketaSoapClient.getTracking(parcel.packetId);

  return (
    <Paper className="mt-2 px-3 py-2 divide-y-2">
      <p className="font-title text-lg pb-2">Info ze Zásilkovny</p>
      <ul role="list" className="space-y-6 pt-3">
        {result.map((value, index, allItems) => (
          <li key={value.dateTime} className="relative flex gap-x-4">
            <div
              className={clsx(
                index === allItems.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
            </div>
            <div className="flex-auto">
              <time
                dateTime={value.dateTime}
                className="flex-none py-0.5 text-xs leading-5 text-deep-green-300 font-bold"
              >
                {dayjs.tz(value.dateTime).format(DEFAULT_DATE_FORMAT)}
              </time>
              <p className="py-0.5 text-xs leading-5 text-gray-500">
                {value.statusText}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {/* <Link>
        Vytisknout
      </Link> */}
    </Paper>
  );
};
