import { Pagination } from '@app-components/Pagination';
import { Skeleton } from '@components/common/Skeleton';
import { Section } from '@components/portal';
import { getCachedAuthenticatedUser } from '@server/utils/getCachedAuthenticatedUser';
import { getCachedOrders } from '@server/utils/getCachedOrders';
import { FC, PropsWithChildren, Suspense } from 'react';

import { OrderPreviewItem } from '../_components/OrderPreviewItem';

export const metadata = {
  title: 'Moje objednávky',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const Th: FC<PropsWithChildren> = ({ children }) => (
  <th
    scope="col"
    className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
  >
    {children}
  </th>
);

const List: FC = async () => {
  const loggedInUser = await getCachedAuthenticatedUser();
  const orders = await getCachedOrders({ user: { id: [loggedInUser.id] } });

  return (
    <div>
      <ul role="list" className="divide-y divide-gray-100">
        {orders.items.map((order) => (
          <OrderPreviewItem key={order.id} order={order} />
        ))}
      </ul>

      <Pagination currentPage={orders.page} totalPages={orders.totalPages} />
    </div>
  );
};

export default function Page() {
  return (
    <Section>
      <div className="px-5 flex justify-between items-center mt-3 pb-3 !mb-0">
        <h1 className="text-2xl font-title tracking-wide">{metadata.title}</h1>
      </div>
      {/* <SearchForm
          initialData={{
            query,
            address: selectedMunicipality
              ? { municipality: selectedMunicipality }
              : undefined,
          }}
        /> */}
      <div className="inline-block min-w-full py-2 align-middle overflow-x-auto px-5">
        <Suspense
          fallback={
            <>
              <Skeleton className="w-full h-9" />
              {new Array(8).fill(true).map((_, index) => (
                <Skeleton key={index} className="w-full h-12 mt-2" />
              ))}
              <div className="flex justify-between gap-2 mt-1">
                <Skeleton className="h-9 w-full max-w-24" />
                <Skeleton className="h-9 w-full max-w-[220px]" />
              </div>
            </>
          }
        >
          <List />
        </Suspense>
      </div>
    </Section>
  );
}
