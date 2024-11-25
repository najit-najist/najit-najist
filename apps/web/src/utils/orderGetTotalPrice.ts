import { Order } from '@najit-najist/database/models';

export const orderGetTotalPrice = (
  order: Pick<
    Order,
    'subtotal' | 'deliveryMethodPrice' | 'paymentMethodPrice' | 'discount'
  >,
  { applyDiscount = true }: { applyDiscount?: boolean } = {},
) => {
  return (
    order.subtotal +
    (order.deliveryMethodPrice ?? 0) +
    (order.paymentMethodPrice ?? 0) -
    (applyDiscount ? order.discount : 0)
  );
};
