import { LeftSidebar } from '@components/layout/LeftSidebar';
import { LayoutComponent } from '@custom-types';
import { Suspense } from 'react';
import { Content } from './Content';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const PortalLayout: LayoutComponent = ({ children }) => {
  const cookieStore = cookies();
  const session = cookieStore.get(`najit-najist-session`);

  // TODO: Should we check for expiry too?
  if (!session) {
    redirect(`/login`);
  }

  // useEffect(() => {
  //   // IF not logged in
  //   if (true) {
  //     router.replace('/login');
  //   } else {
  //     setIsLoaded(true);
  //   }
  // }, []);

  return (
    <>
      <LeftSidebar />
      <div className="w-full">
        <main>
          <Suspense fallback={<>Loading....</>}>
            <Content>{children}</Content>
          </Suspense>
        </main>
      </div>
    </>
  );
};

export default PortalLayout;
