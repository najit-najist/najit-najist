import { Pagination } from '@app-components/Pagination';
import { BreadcrumbItem, Breadcrumbs } from '@components/common/Breadcrumbs';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { AppRouterOutput } from '@custom-types/AppRouter';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { getCachedUsers } from '@server/utils/getCachedUsers';
import { createTrpcCaller } from '@server/utils/server';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { z } from 'zod';

import { SearchForm } from './_components/SearchForm';
import { Users } from './_components/Users';

type Params = {
  searchParams: Promise<{
    search?: string;
    query?: string;
    page?: string;
  }>;
};

export const metadata = {
  title: 'Uživatelé',
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

const searchSchema = z.object({
  page: z.string().transform(Number).default('1'),
  query: z.string().optional(),
  'address.municipality': z
    .string()
    .transform((item) => item.split(','))
    .optional(),
});

export default async function Page({ searchParams }: Params) {
  const breadcrumbs: BreadcrumbItem[] = [
    { link: '/administrace', text: 'Administrace' },
    { link: '/administrace/uzivatele', text: 'Uživatelé', active: true },
  ];

  const {
    query,
    page: pageFromParams,
    ...filter
  } = await searchSchema
    .parseAsync(await searchParams)
    .catch(() => ({}) as Partial<z.infer<typeof searchSchema>>);
  const {
    items: users,
    totalItems,
    page,
    totalPages,
  } = await getCachedUsers({
    search: query,
    page: pageFromParams || 1,
    filter: filter['address.municipality']
      ? {
          address: filter['address.municipality'].map((itemId) => ({
            id: Number(itemId),
          })),
        }
      : undefined,
  });

  let selectedMunicipality:
    | AppRouterOutput['address']['municipality']['get']['many'][number]
    | undefined = undefined;
  // TODO: implement selecting more
  const selectedMunicipalityId = filter['address.municipality']?.at(0);

  if (selectedMunicipalityId) {
    const trpc = await createTrpcCaller();
    const municipalities = await trpc.address.municipality.get.many({
      filter: { id: [Number(selectedMunicipalityId)] },
    });

    selectedMunicipality = municipalities.at(0);
  }

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
            href="/administrace/uzivatele/novy"
            className={buttonStyles({
              appearance: 'ghost',
              className: 'w-16 h-16 !px-2',
            })}
          >
            <PlusIcon className="inline w-12" />
          </Link>
        </div>
        <SearchForm
          initialData={{
            query,
            address: selectedMunicipality
              ? { municipality: selectedMunicipality }
              : undefined,
          }}
        />
      </PageHeader>
      <div className="mt-8 flow-root !border-t-0 container">
        <div className="overflow-x-auto mb-10">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <Th>Jméno</Th>
                  <Th>Telefon</Th>
                  <Th>Stav</Th>
                  <Th>Role</Th>
                  <Th>Obec</Th>
                  <Th>Datum registrace</Th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <Users users={users} />
              </tbody>
              <tfoot className=" w-full">
                <tr>
                  <th colSpan={6} className="">
                    <Pagination
                      currentPage={page}
                      totalItems={totalItems}
                      totalPages={totalPages}
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
