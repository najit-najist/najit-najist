import { config } from 'config';
import { getIronSession } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Gets next session in edge
 */
export const getEdgeSession = async (req: NextRequest, res: NextResponse) =>
  getIronSession(req, res, config.server.session);
