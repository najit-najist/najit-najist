import { database } from '@najit-najist/database';
import { Order, orders } from '@najit-najist/database/models';

import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

export const getOrderById = async (orderId: Order['id']) => {
  const item = await database.query.orders.findFirst({
    where: (schema, { eq }) => eq(schema.id, orderId),
    with: {
      address: true,
      deliveryMethod: true,
      orderedProducts: {
        with: {
          product: true,
        },
      },
      paymentMethod: {
        with: {
          exceptDeliveryMethods: true,
        },
      },
      telephone: true,
    },
  });

  if (!item) {
    throw new EntityNotFoundError({
      entityName: orders._.name,
    });
  }

  return item;
};
