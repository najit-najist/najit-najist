import { OrderUnderpageContentLoading } from '@components/page-components/OrderUnderpageContent/OrderUnderpageContentLoading';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Loading() {
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
      <OrderUnderpageContentLoading />
    </>
  );
}
