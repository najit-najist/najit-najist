import { LeftSidebar } from './LeftSidebar';
import { LayoutComponent } from '@custom-types';
import { Suspense } from 'react';

export const metadata = {
  title: {
    template: 'Portál > %s | Najít Najíst',
    default: 'Hlavní stránka',
  },
};

export const metadata = {
  title: 'Portál > %s',
};

const PortalLayout: LayoutComponent = ({ children }) => {
  return (
    <div className="w-full flex flex-col">
      <Suspense fallback={<>Načítám....</>}>
        <div className="mx-auto lg:grid lg:grid-cols-10 h-full w-full">
          <LeftSidebar />
          <main className="w-full col-span-8 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </Suspense>
    </div>
  );
};

export default PortalLayout;
