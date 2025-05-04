import { BreadcrumbItem, Breadcrumbs } from '@components/common/Breadcrumbs';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { SortableTree } from '@components/common/SortableTree';
import { TreeItem } from '@components/common/SortableTree/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'Kategorie produktů',
};

async function TableContent() {
  const items = await database.query.productCategories.findMany({
    orderBy: (schema, { asc }) => asc(schema.order),
  });

  const contextItems = items.map(
    (item): TreeItem => ({
      ...item,
      id: String(item.id),
      parentId: item.parentId ? String(item.parentId) : null,
      index: item.order,
    }),
  );

  return <SortableTree items={contextItems} />;
}

export default function Page() {
  const breadcrumbs: BreadcrumbItem[] = [
    { link: '/administrace', text: 'Administrace' },
    {
      link: '/administrace/kategorie-produktu',
      text: 'Kategorie produktů',
      active: true,
    },
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
            href="/administrace/kategorie-produktu/novy"
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
      <div className="mt-8 flow-root !border-t-0">
        <div className="overflow-x-auto mb-10">
          <div className="mx-auto container">
            <Suspense
              fallback={
                <table className="min-w-full divide-y divide-gray-300 container">
                  <tbody>
                    <tr>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              }
            >
              <TableContent />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
