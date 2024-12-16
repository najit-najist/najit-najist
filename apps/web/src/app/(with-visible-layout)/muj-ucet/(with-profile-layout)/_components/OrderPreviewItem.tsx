import { OrderStateBadge } from '@app-components/OrderStateBadge';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Skeleton } from '@components/common/Skeleton';
import { DATABASE_TIME_FORMAT, DEFAULT_DATE_FORMAT } from '@constants';
import { AppRouterOutput } from '@custom-types/AppRouter';
import { dayjs } from '@dayjs';
import { formatPrice } from '@utils';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
import Link from 'next/link';
import { FC } from 'react';

export const OrderPreviewItemSkeleton = () => (
  <div className="flex items-center justify-between py-3">
    <div className="">
      <Skeleton className="w-10 h-5" />
      <Skeleton className="w-20 h-5 mt-1" />
    </div>
    <Skeleton className="w-10 h-5" />
  </div>
);

export const OrderPreviewItem: FC<{
  order: AppRouterOutput['orders']['get']['many']['items'][number];
}> = ({ order }) => (
  <li className="flex items-center justify-between gap-x-6 py-3">
    <div className="min-w-0">
      <div className="flex items-start gap-x-3">
        <p className="text-sm/6 font-semibold text-project-primary">
          #{order.id}
        </p>
        <OrderStateBadge state={order.state} />
      </div>
      <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
        <p className="whitespace-nowrap">
          Objednáno{' '}
          <time
            dateTime={
              order.createdAt
                ? dayjs(order.createdAt).format(DATABASE_TIME_FORMAT)
                : undefined
            }
          >
            {dayjs(order.createdAt).format(DEFAULT_DATE_FORMAT)}
          </time>
        </p>
        {/* <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
        <circle r={1} cx={1} cy={1} />
      </svg>
      <p className="truncate">Dokončeno {project.createdBy}</p> */}
        <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
          <circle r={1} cx={1} cy={1} />
        </svg>
        <p className="whitespace-nowrap font-bold">
          {formatPrice(orderGetTotalPrice(order))}
        </p>
      </div>
    </div>
    <div className="flex flex-none items-center gap-x-4">
      <Link
        href={`/muj-ucet/objednavky/${order.id}`}
        className={buttonStyles({
          size: 'xsm',
          appearance: 'link',
        })}
      >
        Zobrazit<span className="sr-only">, objednávku číslo {order.id}</span>
      </Link>
    </div>
  </li>
);
