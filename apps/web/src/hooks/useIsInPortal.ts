import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export const useIsInPortal = () => {
  const pathname = usePathname();

  return useMemo(() => pathname?.startsWith('/portal'), [pathname]);
};
