'use client';

import { Header, Footer } from '@components/layout';

import '../globals.css';
import { LayoutComponent } from '../../.next/types/app/layout';

const RootLayout: LayoutComponent = ({ children }) => {
  return (
    <html lang="cs">
      <body className="bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
