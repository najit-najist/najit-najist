import { LayoutComponent } from '@custom-types';
import { Suspense } from 'react';
import { Content } from './Content';

const PortalLayout: LayoutComponent = ({ children }) => {
  // useEffect(() => {
  //   // IF not logged in
  //   if (true) {
  //     router.replace('/login');
  //   } else {
  //     setIsLoaded(true);
  //   }
  // }, []);

  return (
    <Suspense fallback={<>Loading....</>}>
      <Content>{children}</Content>
    </Suspense>
  );
};

export default PortalLayout;
