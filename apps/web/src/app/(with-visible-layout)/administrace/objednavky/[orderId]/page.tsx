import { OrderUnderpageContent } from '@components/page-components/OrderUnderpageContent';
import { OrderUnderpageContentLoading } from '@components/page-components/OrderUnderpageContent/OrderUnderpageContentLoading';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getLoggedInUserId, logger } from '@najit-najist/api/server';
import { database } from '@najit-najist/database';
import { orders } from '@najit-najist/database/models';
import { and, eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type PageProps = {
  params: {
    orderId: string;
  };
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Detail vytvořené objednávky',
};

export default async function Page({ params }: PageProps) {
  const userId = await getLoggedInUserId();
  const orderId = Number(params.orderId);

  const selectQuery = database
    .select({ n: sql`1` })
    .from(orders)
    .where(
      and(eq(orders.id, Number(params.orderId)), eq(orders.userId, userId))
    );

  const {
    rows: [{ exists }],
  } = await database.execute<{ exists: boolean }>(
    sql`select exists(${selectQuery}) as exists`
  );

  if (!exists) {
    logger.error({}, 'Failed to get order');
    return notFound();
  }

  return (
    <>
      <div className="container mt-5 -mb-5">
        <Link
          href="/administrace/objednavky"
          className="text-red-400 hover:underline group"
        >
          <ArrowLeftIcon
            strokeWidth={3}
            className="w-4 h-4 inline-block relative -top-0.5 group-hover:-translate-x-1 mr-1 duration-100"
          />
          Zpět na výpis objednávek
        </Link>
      </div>
      <Suspense fallback={<OrderUnderpageContentLoading />}>
        <OrderUnderpageContent orderId={orderId} viewType="update" />
      </Suspense>
    </>
  );
}
