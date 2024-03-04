import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

import { config } from '../../config';

export const setupCors = (req: NextApiRequest, res: NextApiResponse) => {
  const corsOrigins = config.server.cors.allowed;

  return (NextCors as any).default(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: corsOrigins,
    maxAge: config.server.session.cookieOptions.maxAge,
    optionsSuccessStatus: 200,
  });
};
