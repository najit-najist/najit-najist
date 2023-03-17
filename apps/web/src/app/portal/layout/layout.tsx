import { LeftSidebar } from '@components/layout/LeftSidebar';
import { LayoutComponent } from '@custom-types';
import { Suspense } from 'react';
import { Content } from './Content';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Header } from './Header';

const PortalLayout: LayoutComponent = ({ children }) => {
  const cookieStore = cookies();
  const session = cookieStore.get(`najit-najist-session`);

  // TODO: Should we check for expiry too?
  if (!session) {
    redirect(`/login`);
  }

  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="mx-auto sm:px-6 lg:grid lg:grid-cols-8 lg:gap-12 lg:px-8 h-full w-full">
        <LeftSidebar />
        <main className="w-full col-span-5 py-6">
          <Suspense fallback={<>Načítám....</>}>
            <Content>{children}</Content>
          </Suspense>
        </main>
        <div className="col-span-2 " />
      </div>
    </div>
  );
};

export default PortalLayout;
