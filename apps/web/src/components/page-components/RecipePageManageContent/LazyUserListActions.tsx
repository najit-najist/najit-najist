'use client';

import { Skeleton } from '@najit-najist/ui';
import dynamic from 'next/dynamic';

export const LazyUserListActions = dynamic(
  async () => {
    const modules = await import('./UserListActions');

    return modules.UserListActions;
  },
  {
    ssr: false,
    loading: () => (
      <>
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-9 h-9" />
      </>
    ),
  }
);
