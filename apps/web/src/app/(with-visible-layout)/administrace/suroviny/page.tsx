import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, PropsWithChildren, Suspense } from 'react';

import { TableContent } from './_internals/TableContent';

export const metadata = {
  title: 'Suroviny',
};

const Th: FC<PropsWithChildren> = ({ children }) => (
  <th
    scope="col"
    className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
  >
    {children}
  </th>
);

export default function Page() {
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
        <div className="flex justify-between items-center mb-4">
          <PageTitle>{metadata.title}</PageTitle>
          <Link href="/administrace/suroviny/novy" className="">
            <PlusIcon className="inline w-12" />
          </Link>
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
                  <Th>Název</Th>
                  <Th>Součást produků (počet)</Th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <Suspense
                fallback={
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                }
              >
                <TableContent />
              </Suspense>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
