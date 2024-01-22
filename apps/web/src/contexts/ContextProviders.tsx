'use client';

import { customTrpcLink } from '@constants';
import { getSuperJson, serverPort } from '@najit-najist/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { FC, PropsWithChildren, useState } from 'react';

import { trpc } from '../trpc';
import { EditorJsInstancesProvider } from './editorJsInstancesContext';

// import { usePathname } from 'next/navigation';
// import { useGtag } from '@hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const transformer = getSuperJson();

export const ContextProviders: FC<PropsWithChildren & { cookies?: string }> = ({
  children,
  cookies,
}) => {
  // const pathname = usePathname();
  // const { track } = useGtag();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer,
      links: [
        customTrpcLink,
        httpBatchLink({
          url: new URL(
            '/api/trpc',
            typeof window === 'undefined'
              ? `http://127.0.0.1:${serverPort}`
              : window.location.origin
          ).toString(),
          headers: {
            cookie: cookies,
          },
        }),
      ],
    })
  );

  return (
    <EditorJsInstancesProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </EditorJsInstancesProvider>
  );
};
