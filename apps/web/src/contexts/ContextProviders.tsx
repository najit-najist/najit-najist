'use client';

import { TRPC_API_URL } from '@constants';
import { FC, PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from '../trpc';

export const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: TRPC_API_URL.toString(),
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
