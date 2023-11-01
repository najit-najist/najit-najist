import { PageTitle } from '@components/common/PageTitle';
import { FC, PropsWithChildren } from 'react';
import { getCachedUsers } from '@server-utils';
import { SearchForm } from './_components/SearchForm';
import { Users } from './_components/Users';
import { PageHeader } from '@components/common/PageHeader';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Footer } from './_components/Footer';

type Params = {
  searchParams: {
    query?: string;
  };
};

export const metadata = {
  title: 'Uživatelé',
};

export const revalidate = 0;

const Th: FC<PropsWithChildren> = ({ children }) => (
  <th
    scope="col"
    className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
  >
    {children}
  </th>
);

export default async function Page({ searchParams }: Params) {
  const { query } = searchParams;
  const {
    items: users,
    totalItems,
    page,
    totalPages,
  } = await getCachedUsers({
    search: query,
  });

  return (
    <>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
          <Link href="/administrace/uzivatele/novy" className="">
            <PlusIcon className="inline w-12" />
          </Link>
        </div>
        <SearchForm initialData={{ query }} />
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
                  <th colSpan={5} className="">
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
