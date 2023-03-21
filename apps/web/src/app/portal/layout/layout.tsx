import { LeftSidebar } from './LeftSidebar';
import { LayoutComponent } from '@custom-types';
import { Suspense } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_NAME } from '@najit-najist/api';

const PortalLayout: LayoutComponent = ({ children }) => {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_NAME);

  // TODO: Should we check for expiry too?
  if (!session) {
    redirect(`/login`);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="mx-auto lg:grid lg:grid-cols-8 lg:gap-12 h-full w-full">
        <LeftSidebar />
        <main className="w-full col-span-5 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<>Načítám....</>}>{children}</Suspense>
        </main>
        <div className="col-span-2" />
      </div>
    </div>
  );
};

export default PortalLayout;
