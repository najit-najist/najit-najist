import { Order } from '@najit-najist/database/models';

export const orderCreateComgateRefId = (order: Order) => String(order.id);
