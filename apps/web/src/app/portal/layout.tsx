'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutComponent } from '../../../.next/types/app/layout';

const PortalLayout: LayoutComponent = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // IF not logged in
    if (true) {
      router.replace('/login');
    } else {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return <>Loading...</>;
  }

  return <>dsfasd {children}</>;
};

export default PortalLayout;
