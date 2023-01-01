'use client';

import { useCurrentUser } from '@hooks';
import { FC, PropsWithChildren } from 'react';

export const Content: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading, isError } = useCurrentUser();

  return (
    <>
      {JSON.stringify(data || {})} {children}
    </>
  );
};
