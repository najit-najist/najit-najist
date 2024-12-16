import { OrderStateBadge } from '@app-components/OrderStateBadge';
import { Badge } from '@components/common/Badge';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { DEFAULT_DATE_FORMAT } from '@constants';
import { AppRouterOutput } from '@custom-types/AppRouter';
import { dayjs } from '@dayjs';
import { formatPrice } from '@utils';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
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
                {dayjs.tz(order.createdAt).format(DEFAULT_DATE_FORMAT)}
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
                {order.discount ? (
                  <>
                    <s>
                      {formatPrice(
                        orderGetTotalPrice(order, { applyDiscount: false }),
                      )}
                    </s>{' '}
                  </>
                ) : null}
                {formatPrice(orderGetTotalPrice(order))}
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div className="text-gray-500">
                {formatPrice(orderGetTotalPrice(order))}
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div className="text-gray-500">
                {order.couponPatch ? (
                  <Badge color="blue">{order.couponPatch.coupon.name}</Badge>
                ) : (
                  <span className="text-rose-400">Ne</span>
                )}
              </div>
            </td>

            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <Link
                href={`/administrace/objednavky/${order.id}`}
                className={buttonStyles({
                  size: 'sm',
                  appearance: 'link',
                })}
              >
                Ukázat
              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={7} className="text-center py-5">
            Žádné objednávky
          </td>
        </tr>
      )}
    </>
  );
};
