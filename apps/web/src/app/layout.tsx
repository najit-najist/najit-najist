'use client';

import { Header, Footer, NewsletterSubscribe } from '@components/layout';
import { FC, PropsWithChildren } from 'react';

import '../globals.css';

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="cs">
      <body className="bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container">
        <Header />
        <main>{children}</main>
        <NewsletterSubscribe />
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
