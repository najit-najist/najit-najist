import { SESSION_NAME, sessionSecret } from '@constants';
import { getIronSession, IronSessionData } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Gets next session in edge
 */
export const getEdgeSession = async (req: NextRequest, res: NextResponse) =>
  getIronSession<IronSessionData>(req, res, {
    cookieName: SESSION_NAME,
    password: sessionSecret,
  });
