import '../globals.css';
import { LayoutComponent } from '@custom-types';
import { ContextProviders } from '@contexts';

const RootLayout: LayoutComponent = ({ children }) => {
  return (
    <html lang="cs">
      <body className="bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container min-h-screen flex">
        <ContextProviders>{children}</ContextProviders>
      </body>
    </html>
  );
};

export default RootLayout;
