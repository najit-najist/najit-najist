import { BreadcrumbItem, Breadcrumbs } from '@components/common/Breadcrumbs';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, PropsWithChildren, Suspense } from 'react';

import { TableContent } from './_internals/TableContent';

export const metadata = {
  title: 'Kupóny',
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
  const breadcrumbs: BreadcrumbItem[] = [
    { link: '/administrace', text: 'Administrace' },
    { link: '/administrace/kupony', text: 'Kupóny', active: true },
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
        <div className="flex justify-between items-center mb-4">
          <PageTitle>{metadata.title}</PageTitle>
          <Link
            href="/administrace/kupony/novy"
            className={buttonStyles({
              appearance: 'ghost',
              className: 'w-16 h-16 !px-2',
            })}
          >
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
                  <Th>Aktivováno</Th>
                  <Th>Název</Th>
                  <Th>Sleva</Th>
                  <Th>Validita</Th>
                  <Th>Vytvořeno dne</Th>
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
