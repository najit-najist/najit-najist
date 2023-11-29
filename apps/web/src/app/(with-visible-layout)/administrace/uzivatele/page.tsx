import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/solid';
import { AppRouterOutput } from '@najit-najist/api';
import { getTrpcCaller } from '@najit-najist/api/server';
import { getCachedUsers } from '@server-utils';
import { TRPCClientError } from '@trpc/client';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { z } from 'zod';

import { Footer } from './_components/Footer';
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
            id: itemId,
          })),
        }
      : undefined,
  });

  let selectedMunicipality:
    | AppRouterOutput['address']['municipality']['get']['many']['items'][number]
    | undefined = undefined;
  // TODO: implement selecting more
  const selectedMunicipalityId = filter['address.municipality']?.at(0);

  if (selectedMunicipalityId) {
    const municipalities = await getTrpcCaller().address.municipality.get.many({
      filter: { id: [selectedMunicipalityId] },
    });

    selectedMunicipality = municipalities.items.at(0);
  }

  return (
    <>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
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
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Obec</Th>
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
                    <Footer
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
