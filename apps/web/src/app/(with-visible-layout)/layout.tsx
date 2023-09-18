import { Footer, Header } from '@components/layout';
import { LayoutComponent } from '@custom-types';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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
