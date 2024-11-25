import { ComgatePayment, Order } from '@najit-najist/database/models';

export const orderGetComgateRefId = (
  order: Order & { comgatePayment: ComgatePayment },
) => order.comgatePayment.transactionId;
