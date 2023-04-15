import { Section } from '@components/portal';

import { FC, PropsWithChildren, Suspense } from 'react';
import { Header } from './components/Header';
import { Users } from './components/Users';

const Th: FC<PropsWithChildren> = ({ children }) => (
  <th
    scope="col"
    className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
  >
    {children}
  </th>
);

const UsersListPage: FC = () => {
  return (
    <Section>
      <Header />
      <div className="mt-8 flow-root !border-t-0 mx-10">
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="sr-only">
                    Name
                  </th>
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
              <tbody className="divide-y divide-gray-200 bg-white">
                <Suspense fallback={<>loading</>}>
                  <Users />
                </Suspense>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default UsersListPage;
