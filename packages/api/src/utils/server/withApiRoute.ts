import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';

import { config } from '../../config';
import rateLimit from './rateLimit';
import { setupCors } from './setupCors';

/**
 * Attaches all necessary things to api route
 */
export const withApiRoute = (handler: NextApiHandler) =>
  withIronSessionApiRoute(async (req, res) => {
    await setupCors(req, res);

    // Limit requests in production
    if (process.env.NODE_ENV === 'production') {
      const limiter = rateLimit({
        interval: 60 * 1000,
        uniqueTokenPerInterval: 500,
      });
      try {
        await limiter.check(res, 60, 'CACHE_TOKEN');
      } catch {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
    }

    return handler(req, res);
  }, config.server.session);
