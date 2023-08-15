import { Footer, Header } from '@components/layout';
import { LayoutComponent } from '@custom-types';

const Layout: LayoutComponent = ({ children }) => {
  return (
    <div className="w-full">
      {/* @ts-ignore */}
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
