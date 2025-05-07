import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Section } from '@components/portal';
import { UserWithRelations } from '@server/services/UserService';
import { getCachedOrders } from '@server/utils/getCachedOrders';
import Link from 'next/link';
import { FC, Suspense } from 'react';

import {
  OrderPreviewItem,
  OrderPreviewItemSkeleton,
} from '../_components/OrderPreviewItem';

const MAX_NUMBER_OF_ORDERS = 6;

const Orders: FC<{ user: UserWithRelations }> = async ({ user }) => {
  const latestOrders = await getCachedOrders({
    user: { id: [user.id] },
    perPage: MAX_NUMBER_OF_ORDERS + 1,
  });

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {latestOrders.items.slice(0, MAX_NUMBER_OF_ORDERS).map((order) => (
          <OrderPreviewItem key={order.id} order={order} />
        ))}
      </ul>

      {latestOrders.items.length === MAX_NUMBER_OF_ORDERS + 1 ? (
        <Link
          href="/muj-ucet/objednavky"
          className="text-project-primary hover:underline text-sm ml-auto block"
        >
          Zobrazit starší objednávky
        </Link>
      ) : null}
    </>
  );
};

export const MyOrdersSection: FC<{ user: UserWithRelations }> = ({ user }) => {
  return (
    <Section>
      <div className="px-5 flex items-center mt-3 pb-3 !mb-0">
        <h1 className="text-2xl font-title tracking-wide">Moje objednávky</h1>

        <Link
          href="/eshop"
          className={buttonStyles({
            className: 'ml-auto',
            size: 'sm',
          })}
        >
          Jít nakupovat
        </Link>
      </div>
      <div className="px-5 flex flex-col">
        <Suspense
          fallback={
            <div className="divide-y divide-gray-100">
              {new Array(MAX_NUMBER_OF_ORDERS)
                .fill(true)
                .map((_value, index) => (
                  <OrderPreviewItemSkeleton key={index} />
                ))}
            </div>
          }
        >
          <Orders user={user} />
        </Suspense>
      </div>
    </Section>
  );
};
