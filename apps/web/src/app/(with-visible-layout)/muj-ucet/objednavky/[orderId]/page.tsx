import { OrderUnderpageContent } from '@components/page-components/OrderUnderpageContent';
import { OrderUnderpageContentLoading } from '@components/page-components/OrderUnderpageContent/OrderUnderpageContentLoading';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { and, eq, or, sql } from '@najit-najist/database/drizzle';
import { orders } from '@najit-najist/database/models';
import { getLoggedInUser, getLoggedInUserId } from '@server/utils/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type PageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Detail vytvořené objednávky',
};

export default async function Page({ params }: PageProps) {
  const user = await getLoggedInUser();
  const { orderId: orderIdAsString } = await params;
  const orderId = Number(orderIdAsString);

  const selectQuery = database
    .select({ n: sql`1` })
    .from(orders)
    .where(
      and(
        eq(orders.id, orderId),
        or(
          eq(orders.userId, user.id),
          eq(sql`lower(${orders.email})`, user.email.toLowerCase()),
        ),
      ),
    );

  const {
    rows: [{ exists }],
  } = await database.execute<{ exists: boolean }>(
    sql`select exists(${selectQuery}) as exists`,
  );

  if (!exists) {
    logger.error('[PROFILE/ORDERS] Failed to find order under account', {
      orderId,
    });
    return notFound();
  }

  return (
    <>
      <div className="container mt-5 -mb-5">
        <Link
          href="/muj-ucet/objednavky"
          className="text-red-400 hover:underline group"
        >
          <ArrowLeftIcon
            strokeWidth={3}
            className="w-4 h-4 inline-block relative -top-0.5 group-hover:-translate-x-1 mr-1 duration-100"
          />
          Zpět na moje objednávky
        </Link>
      </div>
      <Suspense fallback={<OrderUnderpageContentLoading />}>
        <OrderUnderpageContent orderId={orderId} viewType="view" />
      </Suspense>
    </>
  );
}
