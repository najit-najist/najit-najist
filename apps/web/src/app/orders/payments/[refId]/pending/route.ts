import {
  Comgate,
  ComgateOrderState,
  isComgateStatusSuccessfulRequest,
  logger,
} from '@najit-najist/api/server';
import { database } from '@najit-najist/database';
import { comgatePayments } from '@najit-najist/database/models';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { refId: string } }
) => {
  const { refId } = params;

  const comgatePayment = await database.query.comgatePayments.findFirst({
    where: eq(comgatePayments.orderId, Number(refId)),
  });

  if (!comgatePayment) {
    logger?.error(
      { params },
      'User tried to hit pending redirect on order that does not exist'
    );

    notFound();
  }

  const { data: stateFromComgate } = await Comgate.getStatus({
    transId: comgatePayment?.transactionId!,
  });

  if (
    !isComgateStatusSuccessfulRequest(stateFromComgate) ||
    stateFromComgate.status !== ComgateOrderState.PENDING
  ) {
    logger?.error(
      { params, stateFromComgate },
      'User tried to hit pending redirect on order is not pending or does not exist'
    );

    notFound();
  }

  const myOrderPage = `/muj-ucet/objednavky/${refId}`;
  revalidatePath(myOrderPage);
  redirect(myOrderPage);
};