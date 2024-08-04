import { getIronSession, IronSessionData } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';

import { config } from '../../config';

/**
 * Gets next session in edge
 */
export const getEdgeSession = async (req: NextRequest, res: NextResponse) =>
  getIronSession<IronSessionData>(req, res, config.server.session);
