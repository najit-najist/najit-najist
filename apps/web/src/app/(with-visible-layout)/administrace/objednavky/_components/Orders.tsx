import { OrderStateBadge } from '@app-components/OrderStateBadge';
import { DEFAULT_DATE_FORMAT } from '@constants';
import { AppRouterOutput } from '@najit-najist/api';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FC } from 'react';

export const Orders: FC<{
  orders: AppRouterOutput['orders']['get']['many']['items'];
}> = async ({ orders }) => {
  return (
    <>
      {orders.length ? (
        orders.map((order) => (
          <tr key={order.id}>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div className="text-gray-500">
                {dayjs(order.created).format(DEFAULT_DATE_FORMAT)}
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {order.user ? (
                <Link
                  className="hover:underline hover:text-project-secondary"
                  href={`/administrace/uzivatele/${order.user.id}`}
                >
                  {order.user.firstName} {order.user.lastName}
                </Link>
              ) : (
                'Neznámý uživatel'
              )}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <OrderStateBadge state={order.state} />
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{order.id}</div>
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div className="text-gray-500">
                {order.subtotal + order.delivery_method?.price} Kč
              </div>
            </td>

            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <Link
                href={`/administrace/objednavky/${order.id}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Ukázat
              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="text-center py-5">
            Žádné objednávky
          </td>
        </tr>
      )}
    </>
  );
};
