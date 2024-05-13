import { Pagination } from '@app-components/Pagination';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Skeleton } from '@najit-najist/ui';
import { getCachedAuthenticatedUser } from '@server/utils/getCachedAuthenticatedUser';
import { getCachedOrders } from '@server/utils/getCachedOrders';
import Link from 'next/link';
import { FC, PropsWithChildren, Suspense } from 'react';

import { Orders } from './_components/Orders';

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
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <Th>Datum</Th>
          <Th>Stav</Th>
          <Th>Referenční číslo</Th>
          <Th>Cena</Th>
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
  );
};

export default function Page() {
  return (
    <>
      <div className="container mt-5 -mb-5">
        <Link
          href="/muj-ucet/profil"
          className="text-red-400 hover:underline group"
        >
          <ArrowLeftIcon
            strokeWidth={3}
            className="w-4 h-4 inline-block relative -top-0.5 group-hover:-translate-x-1 mr-1 duration-100"
          />
          Zpět na můj profil
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
