import { PageTitle } from '@components/common/PageTitle';
import { FC, PropsWithChildren } from 'react';
import { getCachedLoggedInUser, getCachedUsers } from '@server-utils';
import { SearchForm } from './_components/SearchForm';
import { Users } from './_components/Users';
import { redirect } from 'next/navigation';
import { UserRoles } from '@najit-najist/api';

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

export default async function Page() {
  const loggedInUser = await getCachedLoggedInUser();

  if (!loggedInUser || loggedInUser.role !== UserRoles.ADMIN) {
    redirect('/');
  }

  const { items: users, totalItems } = await getCachedUsers();

  return (
    <div className="mt-8 flow-root !border-t-0 container">
      <PageTitle>Uživatelé</PageTitle>
      <SearchForm />
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
            <tfoot className="flex flex-wrap justify-between items-center">
              <div />
              <div>Celkový počet: {totalItems}</div>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
