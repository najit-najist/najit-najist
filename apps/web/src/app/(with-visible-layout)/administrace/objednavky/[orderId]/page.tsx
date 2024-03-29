import { OrderUnderpageContent } from '@components/page-components/OrderUnderpageContent';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { logger } from '@najit-najist/api/server';
import { getCachedOrder } from '@server-utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
  const order = await getCachedOrder({ id: params.orderId }).catch((error) => {
    logger.error({ error }, 'Failed to get order');
    notFound();
  });

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
      <OrderUnderpageContent order={order} viewType="update" />
    </>
  );
}
