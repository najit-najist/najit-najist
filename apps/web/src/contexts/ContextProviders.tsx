'use client';

import { customTrpcLink, serverPort } from '@constants';
import { getSuperJson } from '@server/utils/getSuperJson';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@trpc/web';
import { FC, PropsWithChildren, useState } from 'react';

import { EditorJsInstancesProvider } from './editorJsInstancesContext';

// import { usePathname } from 'next/navigation';
// import { useGtag } from '@hooks';

const queryClient = new QueryClient({});

const transformer = getSuperJson();

export const ContextProviders: FC<PropsWithChildren & { cookies?: string }> = ({
  children,
  cookies,
}) => {
  // const pathname = usePathname();
  // const { track } = useGtag();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        customTrpcLink,
        httpBatchLink({
          url: new URL(
            '/api/trpc',
            typeof window === 'undefined'
              ? `http://127.0.0.1:${serverPort}`
              : window.location.origin,
          ).toString(),
          transformer,

          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    }),
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
