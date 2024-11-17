import { Pagination } from '@app-components/Pagination';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { dayjs } from '@dayjs';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import { Badge, Skeleton } from '@najit-najist/ui';
import { getCachedOrders } from '@server/utils/getCachedOrders';
import { formatPrice } from '@utils';
import { clsx } from 'clsx';
import Link from 'next/link';
import { FC, PropsWithChildren, Suspense } from 'react';

import { Orders } from './_components/Orders';

export const metadata = {
  title: 'Objednávky',
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
  const orders = await getCachedOrders();

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <Th>Datum</Th>
          <Th>Uživatel</Th>
          <Th>Stav</Th>
          <Th>Referenční číslo</Th>
          <Th>Cena za produkty</Th>
          <Th>Cena celkově</Th>
          <Th>Kupôn</Th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <Orders orders={orders.items} />
      </tbody>
      <tfoot className=" w-full">
        <tr>
          <th colSpan={8} className="">
            <Pagination
              currentPage={orders.page}
              totalItems={orders.totalItems}
              totalPages={orders.totalPages}
            />
          </th>
        </tr>
      </tfoot>
    </table>
  );
};

const Analytics: FC = async () => {
  const thisMonth = dayjs();
  const prevMonth = dayjs().set('month', thisMonth.get('month') - 1);

  const ordersThisMonth = await database.query.orders.findMany({
    where: (schema, { lte, gte, and }) =>
      and(
        gte(schema.createdAt, thisMonth.startOf('month').toDate()),
        lte(schema.createdAt, thisMonth.endOf('month').toDate()),
      ),
  });

  const ordersPrevMonth = await database.query.orders.findMany({
    where: (schema, { lte, gte, and }) =>
      and(
        gte(schema.createdAt, prevMonth.startOf('month').toDate()),
        lte(schema.createdAt, prevMonth.endOf('month').toDate()),
      ),
  });

  const thisMonthTotal = ordersThisMonth.reduce(
    (total, current) =>
      total +
      current.subtotal +
      (current.paymentMethodPrice ?? 0) +
      (current.deliveryMethodPrice ?? 0),
    0,
  );
  const prevMonthTotal = ordersPrevMonth.reduce(
    (total, current) =>
      total +
      current.subtotal +
      (current.paymentMethodPrice ?? 0) +
      (current.deliveryMethodPrice ?? 0),
    0,
  );

  const changeCount = ordersThisMonth.length - ordersPrevMonth.length;
  const changeRevenue = thisMonthTotal - prevMonthTotal;

  const stats = [
    {
      name: 'Tento měsíc',
      value: ordersThisMonth.length,
      change: changeCount > 0 ? `+${changeCount}` : changeCount,
      changeType:
        ordersThisMonth.length >= ordersPrevMonth.length
          ? 'positive'
          : 'negative',
    },
    {
      name: 'Příjem',
      value: `${thisMonthTotal}Kč`,
      change:
        changeRevenue > 0
          ? `+${formatPrice(changeRevenue)}`
          : formatPrice(changeRevenue),
      changeType: thisMonthTotal >= prevMonthTotal ? 'positive' : 'negative',
    },
  ];

  return (
    <div className="bg-white">
      <dl className="mx-auto grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4 container divide-x">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-4 sm:px-6 xl:px-8"
          >
            <dt className="text-sm/6 font-medium text-gray-500">{stat.name}</dt>
            {stat.change !== 0 && stat.change !== formatPrice(0) ? (
              <dd>
                <Badge color={stat.changeType === 'negative' ? 'red' : 'green'}>
                  {stat.change}
                </Badge>
              </dd>
            ) : null}
            <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default async function Page() {
  return (
    <>
      <div className="container mt-5 -mb-5">
        <Link
          href="/administrace"
          className="text-red-400 hover:underline group"
        >
          <ArrowLeftIcon
            strokeWidth={3}
            className="w-4 h-4 inline-block relative -top-0.5 group-hover:-translate-x-1 mr-1 duration-100"
          />
          Zpět na rozcestník
        </Link>
      </div>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
        </div>
        {/* <SearchForm
          initialData={{
            query,
            address: selectedMunicipality
              ? { municipality: selectedMunicipality }
              : undefined,
          }}
        /> */}
      </PageHeader>
      <Analytics />
      <div className="mt-8 flow-root !border-t-0 container">
        <div className="overflow-x-auto mb-10">
          <div className="inline-block min-w-full py-2 align-middle">
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
        </div>
      </div>
    </>
  );
}
