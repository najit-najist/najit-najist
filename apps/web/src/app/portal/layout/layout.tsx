import { LeftSidebar } from './LeftSidebar';
import { LayoutComponent } from '@custom-types';
import { Suspense } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_NAME } from '@najit-najist/api';

export const metadata = {
  title: {
    template: 'Portál > %s | Najít Najíst',
    default: 'Hlavní stránka',
  },
};

const PortalLayout: LayoutComponent = ({ children }) => {
  const cookieStore = cookies();

  return (
    <div className="w-full flex flex-col">
      <div className="mx-auto lg:grid lg:grid-cols-10 h-full w-full">
        <LeftSidebar />
        <main className="w-full col-span-8 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<>Načítám....</>}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
