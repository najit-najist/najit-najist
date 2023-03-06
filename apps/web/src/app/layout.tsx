import '../globals.css';
import { LayoutComponent } from '@custom-types';
import { ContextProviders } from '@contexts';
import { headers } from 'next/headers';

const RootLayout: LayoutComponent = ({ children }) => {
  const headersStore = headers();

  return (
    <html lang="cs">
      <body className="bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container min-h-screen flex">
        <ContextProviders cookies={headersStore.get('cookie') ?? undefined}>
          {children}
        </ContextProviders>
      </body>
    </html>
  );
};

export default RootLayout;
