import { FC, PropsWithChildren } from 'react';
import { Header, Footer } from '@components/layout';

import '../globals.css';

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="cs">
      <body className="bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container">
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
