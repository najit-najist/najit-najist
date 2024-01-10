import { Order } from '../../../schemas/orders';
import { DeliveryMethod } from '../../../schemas/orders/order-delivery-methods';
import { OrderPaymentMethod } from '../../../schemas/orders/order-payment-methods';
import { OrderProduct } from '../../../schemas/orders/order-products';
import { User } from '../../../schemas/user.schema';

export type OrderWithExpand = Omit<Order, 'products'> & {
  expand: {
    'order_products(order)': OrderProduct[];
    payment_method: OrderPaymentMethod;
    delivery_method: DeliveryMethod;
    user: Omit<User, 'address'>;
  };
};

export const mapPocketbaseOrder = (base: OrderWithExpand): Order => {
  const {
    expand: {
      'order_products(order)': orderProducts,
      payment_method,
      delivery_method,
      user,
    },
    ...rest
  } = base;

  return {
    ...rest,
    products: orderProducts ?? [],
    payment_method: payment_method,
    delivery_method,
    user,
  };
};
