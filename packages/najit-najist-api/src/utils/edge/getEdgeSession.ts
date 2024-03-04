import { getIronSession } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';

import { config } from '../../config';

/**
 * Gets next session in edge
 */
export const getEdgeSession = async (req: NextRequest, res: NextResponse) =>
  getIronSession(req, res, config.server.session);
