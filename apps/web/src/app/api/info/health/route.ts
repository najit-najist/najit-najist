import { PacketaSoapClient } from '@najit-najist/packeta/soap-client';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Preload packetery api declaration
  (await PacketaSoapClient.getClient()).describe();

  return NextResponse.json({
    alive: true,
  });
}
