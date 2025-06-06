import { comgateClient } from '@comgate-client';
import { logger } from '@logger/server';
import {
  ComgateOrderState,
  isComgateStatusSuccessfulRequest,
} from '@najit-najist/comgate';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import {
  OrderState,
  comgatePayments,
  orders,
} from '@najit-najist/database/models';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params: paramsAsPromise }: { params: Promise<{ refId: string }> },
) => {
  const params = await paramsAsPromise;
  const { refId } = params;

  const comgatePayment = await database.query.comgatePayments.findFirst({
    where: eq(comgatePayments.orderId, Number(refId)),
  });

  if (!comgatePayment) {
    logger.error(
      '[ORDER/PAYMENTS] User tried to hit paid redirect on order that does not exist',
      { params },
    );

    notFound();
  }

  const { data: stateFromComgate } = await comgateClient.getStatus({
    transId: comgatePayment?.transactionId!,
  });

  if (
    !isComgateStatusSuccessfulRequest(stateFromComgate) ||
    stateFromComgate.status !== ComgateOrderState.PAID
  ) {
    logger?.error(
      '[ORDER/PAYMENTS] User tried to hit paid redirect on order is not paid or does not exist',
      { params, stateFromComgate },
    );

    notFound();
  }

  await database
    .update(orders)
    .set({
      state: OrderState.UNCONFIRMED,
    })
    .where(eq(orders.id, comgatePayment.orderId!));

  const myOrderPage = `/muj-ucet/objednavky/${refId}`;
  revalidatePath(myOrderPage);
  revalidatePath(`/administrace/objednavky/${refId}`);
  redirect(myOrderPage);
};
