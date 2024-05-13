import { database } from '@najit-najist/database';
import { getTableName } from '@najit-najist/database/drizzle';
import { Order, orders } from '@najit-najist/database/models';

import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

export const getOrderById = async (orderId: Order['id']) => {
  const item = await database.query.orders.findFirst({
    where: (schema, { eq }) => eq(schema.id, orderId),
    with: {
      address: {
        with: {
          municipality: true,
        },
      },
      deliveryMethod: true,
      orderedProducts: {
        with: {
          product: {
            with: {
              images: true,
              price: true,
              stock: true,
            },
          },
        },
      },
      paymentMethod: {
        with: {
          exceptDeliveryMethods: true,
        },
      },
      telephone: true,
      user: {
        columns: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      pickupDate: true,
    },
  });

  if (!item) {
    throw new EntityNotFoundError({
      entityName: getTableName(orders),
    });
  }

  return item;
};
