import { Order } from '../../../schemas/orders';
import { DeliveryMethod } from '../../../schemas/orders/order-delivery-methods';
import { OrderPaymentMethod } from '../../../schemas/orders/order-payment-methods';
import { OrderProduct } from '../../../schemas/orders/order-products';

export type DeliveryMethodWithExpand = Omit<
  DeliveryMethod,
  'paymentMethods'
> & {
  expand: {
    'order_payment_methods(delivery_method)': OrderPaymentMethod[];
  };
};

export type OrderWithExpand = Omit<Order, 'products'> & {
  expand: {
    'order_products(order)': OrderProduct[];
    payment_method: OrderPaymentMethod & {
      expand: { delivery_method: Omit<DeliveryMethod, 'paymentMethods'> };
    };
  };
};

export const mapPocketbaseDeliveryMethods = (
  base: DeliveryMethodWithExpand
): DeliveryMethod => {
  const {
    expand: { 'order_payment_methods(delivery_method)': paymentMethods },
    ...rest
  } = base;

  return {
    ...rest,
    paymentMethods,
  };
};

export const mapPocketbaseOrder = (base: OrderWithExpand): Order => {
  const {
    expand: { 'order_products(order)': orderProducts, payment_method },
    ...rest
  } = base;

  return {
    ...rest,
    products: orderProducts,
    payment_method: {
      ...payment_method,
      delivery_method: payment_method.expand.delivery_method,
    },
  };
};
