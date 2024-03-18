import {
  Comgate,
  ComgateOrderState,
  isComgateStatusSuccessfulRequest,
  logger,
} from '@najit-najist/api/server';
import { database } from '@najit-najist/database';
import {
  OrderState,
  comgatePayments,
  orders,
} from '@najit-najist/database/models';
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
      'User tried to hit paid redirect on order that does not exist'
    );

    notFound();
  }

  const { data: stateFromComgate } = await Comgate.getStatus({
    transId: comgatePayment?.transactionId!,
  });

  if (
    !isComgateStatusSuccessfulRequest(stateFromComgate) ||
    stateFromComgate.status !== ComgateOrderState.PAID
  ) {
    logger?.error(
      { params, stateFromComgate },
      'User tried to hit paid redirect on order is not paid or does not exist'
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
