'use client';

import { Header, Footer } from '@components/layout';

import '../globals.css';
import { LayoutComponent } from '../../.next/types/app/layout';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const RootLayout: LayoutComponent = ({ children }) => {
  const pathname = usePathname();

  const isHeaderShown = useMemo(() => {
    return !pathname?.startsWith('/login');
  }, [pathname]);

  const isFooterShown = useMemo(() => {
    return !pathname?.startsWith('/login') && !pathname?.startsWith('/portal');
  }, [pathname]);

  return (
    <html lang="cs">
      <body className="bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container min-h-screen">
        {isHeaderShown ? <Header /> : null}
        <main>{children}</main>
        {isFooterShown ? <Footer /> : null}
      </body>
    </html>
  );
};

export default RootLayout;
