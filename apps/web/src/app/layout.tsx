'use client';

import { Header, Footer } from '@components/layout';

import '../globals.css';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { LayoutComponent } from '@custom-types';
import { ContextProviders } from '@contexts';
import { LeftSidebar } from '@components/layout/LeftSidebar';
import { useIsInPortal } from '@hooks';

const RootLayout: LayoutComponent = ({ children }) => {
  const pathname = usePathname();
  const isInPortal = useIsInPortal();

  const isHeaderShown = useMemo(() => {
    return !pathname?.startsWith('/login');
  }, [pathname]);

  const isFooterShown = useMemo(() => {
    return !pathname?.startsWith('/login') && !pathname?.startsWith('/portal');
  }, [pathname]);

  return (
    <html lang="cs">
      <body className="bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container min-h-screen flex">
        <ContextProviders>
          {isInPortal ? <LeftSidebar /> : null}
          <div className="w-full">
            {isHeaderShown ? <Header /> : null}
            <main>{children}</main>
            {isFooterShown ? <Footer /> : null}
          </div>
        </ContextProviders>
      </body>
    </html>
  );
};

export default RootLayout;
