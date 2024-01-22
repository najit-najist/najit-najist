import {
  Collections,
  RecordOptions,
  pocketbaseByCollections,
} from '@najit-najist/pb';
import { getItemId } from '@utils/internal';

import {
  OrderWithExpand,
  mapPocketbaseOrder,
} from '../../routes/trpc/orders/_utils';
import { Order } from '../../schemas/orders';
import { ProductService } from '../../server';

export const getOrderById = async (
  orderId: Order['id'],
  requestOptions?: Omit<RecordOptions, 'expand'>
) => {
  const result = await pocketbaseByCollections.orders.getOne<OrderWithExpand>(
    orderId,
    {
      expand: `${Collections.ORDER_PRODUCTS}(order),payment_method,delivery_method,user`,
      ...requestOptions,
    }
  );
  const mappedResult = mapPocketbaseOrder(result);

  const productsToFetch = mappedResult.products.reduce((final, orderItem) => {
    final.push(getItemId(orderItem.product));

    return final;
  }, [] as string[]);

  if (productsToFetch.length) {
    const { items: productsForOrders } = await ProductService.getMany({
      perPage: 99999,
      otherFilters: [
        `( ${productsToFetch.map((id) => `id="${id}"`).join(' || ')} )`,
      ],
    });

    for (const cartItem of mappedResult.products) {
      const productId = getItemId(cartItem.product);

      const productFromFetchedProducts = productsForOrders.find(
        ({ id }) => id === productId
      );

      if (productFromFetchedProducts) {
        cartItem.product = productFromFetchedProducts;
      }
    }
  }

  return mappedResult;
};
