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
  productStock,
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
    with: {
      order: {
        with: {
          orderedProducts: {
            with: {
              product: {
                with: {
                  stock: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!comgatePayment) {
    logger?.error(
      { params },
      'User tried to hit cancelled redirect on order that does not exist'
    );

    notFound();
  }

  const { data: stateFromComgate } = await Comgate.getStatus({
    transId: comgatePayment?.transactionId!,
  });

  if (
    !isComgateStatusSuccessfulRequest(stateFromComgate) ||
    stateFromComgate.status !== ComgateOrderState.CANCELLED
  ) {
    logger?.error(
      { params, stateFromComgate },
      'User tried to hit cancelled redirect on order is not cancelled or does not exist'
    );

    notFound();
  }

  await database
    .update(orders)
    .set({
      state: OrderState.DROPPED,
    })
    .where(eq(orders.id, comgatePayment.orderId!));

  try {
    const productsAndStocksToUpdate =
      comgatePayment.order.orderedProducts.filter(
        ({ product }) => !!product.stock
      );

    await Promise.all(
      productsAndStocksToUpdate.map(({ product, count }) =>
        database
          .update(productStock)
          .set({
            value: product.stock!.value + count,
          })
          .where(eq(productStock.id, product.stock!.id))
      )
    );
  } catch (error) {
    logger.error(
      { error, params },
      'Failed to return products on dropped payment'
    );
  }

  const myOrderPage = `/muj-ucet/objednavky/${refId}`;
  revalidatePath(myOrderPage);
  revalidatePath(`/administrace/objednavky/${refId}`);
  redirect(myOrderPage);
};