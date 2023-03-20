import { config } from '@config';
import { SESSION_NAME } from '@constants';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import rateLimit from './rateLimit';
import { setupCors } from './setupCors';

/**
 * Attaches all necessary things to api route
 */
export const withApiRoute = (handler: NextApiHandler) => {
  const sessionInfo = config.server.session;

  return withIronSessionApiRoute(
    async (req, res) => {
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
    },
    {
      cookieName: SESSION_NAME,
      password: config.server.secrets.session,
      cookieOptions: {
        domain: config.env.isDev ? undefined : sessionInfo.name,
        httpOnly: true,
        maxAge: sessionInfo.maxAge,
        secure: !config.env.isDev,
        sameSite: !config.env.isDev ? 'strict' : 'lax',
      },
    }
  );
};
