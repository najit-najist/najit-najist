import { config } from '@server/config';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const TIMEOUT = 3 * 1000;
const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  const abortController = new AbortController();

  // Catch from outside
  init?.signal?.addEventListener('abort', (reason) => {
    abortController.abort(reason);
  });

  const timeout = setTimeout(() => {
    console.log('timeout happened');
    abortController.abort();
  }, TIMEOUT);

  return fetch(input, {
    ...init,
    signal: abortController.signal,
  }).finally(() => {
    clearTimeout(timeout);
  });
};

export async function GET(request: Request) {
  let pocketbase = await fetchWithTimeout(
    new URL('/api/health', config.pb.origin),
    { cache: 'no-store', next: { revalidate: 0 } }
  )
    .catch((error) => {
      console.error('Failed to connect to pocketbase', error);

      return false;
    })
    .then((res) => {
      if (typeof res === 'boolean') {
        return res;
      }

      console.info('Fetched info from pocketbase', res);

      return res.json();
    });

  return NextResponse.json({
    alive: true,
    pocketbase,
  });
}
