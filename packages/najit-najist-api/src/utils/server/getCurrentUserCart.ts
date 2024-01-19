import { PocketbaseCollections } from '@custom-types';
import { pocketbase } from '@najit-najist/pb';
import { Product, ProductPrice, ProductStock } from '@schemas';

import { AUTHORIZATION_HEADER } from '../..';
import {
  UserCart,
  UserCartProduct,
} from '../../schemas/profile/cart/cart.schema';
import { getSessionFromCookies } from '../../server';

type UserCartWithExpand = Omit<UserCart, 'products'> & {
  expand?: {
    'user_cart_products(cart)': (Omit<UserCartProduct, 'product'> & {
      expand: {
        product: Omit<Product, 'price' | 'stock'> & {
          expand: {
            'product_prices(product)': ProductPrice;
            'product_stock(product)': ProductStock;
          };
        };
      };
    })[];
  };
};

type ReturnType = Omit<UserCart, 'products'> & {
  products: (Omit<UserCartProduct, 'product'> & { product: Product })[];
};

export const getCurrentCart = async (): Promise<
  ReturnType & { price: { subtotal: number } }
> => {
  const session = await getSessionFromCookies();
  const sessionToken = session.authContent?.token;

  const profileCart = await pocketbase.send<UserCartWithExpand>('/cart', {
    method: 'GET',
    headers: {
      ...(sessionToken ? { [AUTHORIZATION_HEADER]: sessionToken } : null),
    },
  });

  const cartResult: ReturnType = {
    ...profileCart,
    products:
      profileCart.expand?.['user_cart_products(cart)'].map(
        (productInCart): ReturnType['products'][number] => ({
          ...productInCart,
          product: {
            ...productInCart.expand.product,
            price:
              productInCart.expand.product.expand['product_prices(product)'],
            stock:
              productInCart.expand.product.expand['product_stock(product)'],
          },
        })
      ) ?? [],
  };

  return {
    ...cartResult,
    price: {
      subtotal: cartResult.products.reduce(
        (totalPrice, cartItem) =>
          totalPrice + cartItem.product.price.value * cartItem.count,
        0
      ),
    },
  };
};
