import { Footer, Header } from '@components/layout';
import { LayoutComponent } from '@custom-types';

export const revalidate = 0;

const Layout: LayoutComponent = ({ children }) => {
  return (
    <div className="w-full">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
