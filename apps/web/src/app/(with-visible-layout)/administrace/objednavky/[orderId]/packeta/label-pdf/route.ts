import { database } from '@najit-najist/database';
import { PacketaSoapClient } from '@najit-najist/packeta/soap-client';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  orderId: string;
};

export const GET = async (
  request: NextRequest,
  context: { params: Promise<Params> },
): Promise<NextResponse> => {
  const { orderId } = await context.params;
  const parcel = await database.query.packetaParcels.findFirst({
    where: (s, { eq }) => eq(s.orderId, Number(orderId)),
  });

  if (!parcel) {
    notFound();
  }

  const base64BinaryPdf = await PacketaSoapClient.getPacketLabelPdfBinary(
    parcel.packetId,
  );

  return new NextResponse(Buffer.from(base64BinaryPdf, 'base64'), {
    headers: {
      'content-type': 'application/pdf',
    },
  });
};
