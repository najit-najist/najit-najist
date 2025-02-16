import { Pagination } from '@app-components/Pagination';
import { Badge } from '@components/common/Badge';
import { BreadcrumbItem, Breadcrumbs } from '@components/common/Breadcrumbs';
import { GoBackButton } from '@components/common/GoBackButton';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { Skeleton } from '@components/common/Skeleton';
import { dayjs } from '@dayjs';
import { database } from '@najit-najist/database';
import { OrderState } from '@najit-najist/database/models';
import { getOrders } from '@server/utils/getOrders';
import { formatPrice } from '@utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FC, PropsWithChildren, Suspense } from 'react';
import { z } from 'zod';

import { Filters } from './Filters';
import { Orders } from './_components/Orders';
import { ADMIN_LIST_VIEW_COOKIE_NAME } from './_constants';
import { OrderPageListView } from './_types';

export const metadata = {
  title: 'Objednávky',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';
const getListViewFromCookies = async (): Promise<OrderPageListView> => {
  const cookie = await cookies();
  let view = cookie.get(ADMIN_LIST_VIEW_COOKIE_NAME)?.value as
    | OrderPageListView
    | undefined;

  if (!view || !Object.values(OrderPageListView).includes(view)) {
    view = OrderPageListView.ALL;
  }

  return view;
};

type PageProps = {
  searchParams: Promise<{
    listView: string;
  }>;
  page: string;
};

const Th: FC<PropsWithChildren> = ({ children }) => (
  <th
    scope="col"
    className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
  >
    {children}
  </th>
);

const List: FC<{ page: number }> = async ({ page }) => {
  const listView = await getListViewFromCookies();

  let state: OrderState[] | undefined = undefined;

  if (listView === OrderPageListView.CANCELED) {
    state = [OrderState.DROPPED];
  } else if (listView === OrderPageListView.FINISHED) {
    state = [OrderState.FINISHED];
  } else if (listView === OrderPageListView.NEW) {
    state = [OrderState.UNCONFIRMED, OrderState.UNPAID, OrderState.NEW];
  } else if (listView === OrderPageListView.UNFINISHED) {
    state = [OrderState.CONFIRMED, OrderState.SHIPPED];
  }

  const orders = await getOrders({
    page,
    perPage: 35,
    state,
  });

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
      value: formatPrice(thisMonthTotal),
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

export default async function Page({
  searchParams: getSearchParams,
}: PageProps) {
  const listViewFromCookies = await getListViewFromCookies();
  const { listView: listViewFromQuery, page: pageAsString } =
    await getSearchParams;
  const page = z.coerce.number().min(1).safeParse(pageAsString).data ?? 1;

  if (listViewFromQuery !== listViewFromCookies) {
    let route = '/administrace/objednavky';
    route += `?listView=${listViewFromCookies}`;

    throw redirect(route);
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { link: '/administrace', text: 'Administrace' },
    { link: '/administrace/objednavky', text: 'Objednávky', active: true },
  ];

  return (
    <>
      <div className="hidden sm:block container mx-auto mt-6 mb-2">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="container mt-5 -mb-5">
        <GoBackButton href="/administrace" text="Zpět na rozcestník" />
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

      <Filters
        initialValues={{
          listView: listViewFromCookies,
        }}
      />

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
              <List page={page} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
