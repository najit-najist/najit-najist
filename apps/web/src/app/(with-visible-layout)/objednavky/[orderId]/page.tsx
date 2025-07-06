import { OrderUnderpageContent } from '@components/page-components/OrderUnderpageContent';
import { OrderUnderpageContentLoading } from '@components/page-components/OrderUnderpageContent/OrderUnderpageContentLoading';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq, sql } from '@najit-najist/database/drizzle';
import { orders } from '@najit-najist/database/models';
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
  const { orderId: orderIdAsString } = await params;
  const orderId = Number(orderIdAsString);

  const selectQuery = database
    .select({ n: sql`1` })
    .from(orders)
    .where(eq(orders.id, orderId));

  const {
    rows: [{ exists }],
  } = await database.execute<{ exists: boolean }>(
    sql`select exists(${selectQuery}) as exists`,
  );

  if (!exists) {
    logger.error('[PROFILE/ORDERS] Failed to find anonymous order', {
      orderId,
    });
    return notFound();
  }

  return (
    <>
      <Suspense fallback={<OrderUnderpageContentLoading />}>
        <OrderUnderpageContent orderId={orderId} viewType="view" />
      </Suspense>
    </>
  );
}
