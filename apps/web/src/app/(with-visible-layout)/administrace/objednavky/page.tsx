import { Pagination } from '@app-components/Pagination';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getCachedOrders } from '@server-utils';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';

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

export default async function Page() {
  const orders = await getCachedOrders();

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
      <div className="mt-8 flow-root !border-t-0 container">
        <div className="overflow-x-auto mb-10">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <Th>Datum</Th>
                  <Th>Uživatel</Th>
                  <Th>Stav</Th>
                  <Th>Referenční číslo</Th>
                  <Th>Cena</Th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <Orders orders={orders.items} />
              </tbody>
              <tfoot className=" w-full">
                <tr>
                  <th colSpan={6} className="">
                    <Pagination
                      currentPage={orders.page}
                      totalItems={orders.totalItems}
                      totalPages={orders.totalPages}
                    />
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
