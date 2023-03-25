import { config, logger } from '@najit-najist/api/server';
import { NextApiHandler } from 'next';

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
    abortController.abort();
  }, TIMEOUT);

  return fetch(input, {
    ...init,
    signal: abortController.signal,
  }).finally(() => {
    clearTimeout(timeout);
  });
};

const handler: NextApiHandler = async () => {
  let pocketbase = await fetchWithTimeout(
    new URL('/api/health', config.pb.origin)
  )
    .catch((error) => {
      logger.error(error, 'Failed to connect to pocketbase');

      return false;
    })
    .then((res) => res);

  return {
    alive: true,
    pocketbase,
  };
};

export default handler;
