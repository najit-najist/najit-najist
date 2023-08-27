'use client';

import { FC, PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { trpc } from '../trpc';
import { serverPort } from '@najit-najist/api';
import SuperJSON from 'superjson';
import { httpBatchLink } from '@trpc/client';
import { EditorJsInstancesProvider } from './editorJsInstancesContext';
import { customTrpcLink } from '@constants';
// import { usePathname } from 'next/navigation';
// import { useGtag } from '@hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

export const ContextProviders: FC<PropsWithChildren & { cookies?: string }> = ({
  children,
  cookies,
}) => {
  // const pathname = usePathname();
  // const { track } = useGtag();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: SuperJSON,
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

  // TODO: is this really necessary?
  // useEffect(() => {
  //   track({
  //     event: 'page_view',
  //     pageUrl: pathname,
  //   });
  // }, [pathname, track]);

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
