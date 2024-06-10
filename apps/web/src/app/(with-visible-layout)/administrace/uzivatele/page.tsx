import { Pagination } from '@app-components/Pagination';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { AppRouterOutput } from '@custom-types/AppRouter';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { getCachedUsers } from '@server/utils/getCachedUsers';
import { getTrpcCaller } from '@server/utils/server';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { z } from 'zod';

import { SearchForm } from './_components/SearchForm';
import { Users } from './_components/Users';

type Params = {
  searchParams: {
    search?: string;
    query?: string;
    page?: string;
  };
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
  const {
    query,
    page: pageFromParams,
    ...filter
  } = await searchSchema
    .parseAsync(searchParams)
    .catch(() => ({} as Partial<z.infer<typeof searchSchema>>));
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
    const municipalities = await getTrpcCaller().address.municipality.get.many({
      filter: { id: [Number(selectedMunicipalityId)] },
    });

    selectedMunicipality = municipalities.at(0);
  }

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
          <Link href="/administrace/uzivatele/novy" className="">
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
