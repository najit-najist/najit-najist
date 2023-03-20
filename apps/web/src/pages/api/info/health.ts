import { config } from '@najit-najist/api/server';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async () => {
  let pocketbase = await fetch(new URL('/api/health', config.pb.origin))
    .catch(() => false)
    .then((res) => res);

  return {
    alive: true,
    pocketbase,
  };
};

export default handler;
