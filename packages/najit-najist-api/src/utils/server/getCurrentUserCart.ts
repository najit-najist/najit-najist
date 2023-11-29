import { PocketbaseCollections } from '@custom-types';
import {
  ClientResponseError,
  pocketbase,
  pocketbaseByCollections,
} from '@najit-najist/pb';
import { Product } from '@schemas';

import { AUTHORIZATION_HEADER } from '../..';
import {
  UserCart,
  UserCartProduct,
} from '../../schemas/profile/cart/cart.schema';
import { getSessionFromCookies } from '../../server';
import { ProductService } from '../../services/Product.service';
import { getLoggedInUser } from './getLoggedInUser';

const USER_CART_EXPAND =
  `${PocketbaseCollections.USER_CART_PRODUCTS}(cart)` as const;

type UserCartWithExpand = Omit<UserCart, 'products'> & {
  expand?: {
    'user_cart_products(cart)': UserCartProduct[];
  };
};

type ReturnType = Omit<UserCart, 'products'> & {
  products: (Omit<UserCartProduct, 'product'> & { product: Product })[];
};

export const getCurrentCart = async (): Promise<
  ReturnType & { price: { total: number } }
> => {
  const session = await getSessionFromCookies();
  const sessionToken = session.authContent?.token;
  const currentUser = await getLoggedInUser();

  // Get active or create new one
  const profileCart = await pocketbaseByCollections.userCarts
    .getFirstListItem<UserCartWithExpand>(`user="${currentUser.id}"`, {
      expand: USER_CART_EXPAND,
      headers: {
        ...(sessionToken ? { [AUTHORIZATION_HEADER]: sessionToken } : null),
      },
    })
    .catch((error) => {
      if (error instanceof ClientResponseError && error.status === 404) {
        return pocketbase
          .collection<UserCartWithExpand>(PocketbaseCollections.USER_CARTS)
          .create(
            {
              user: currentUser.id,
            },
            {
              expand: USER_CART_EXPAND,
              headers: {
                ...(sessionToken
                  ? { [AUTHORIZATION_HEADER]: sessionToken }
                  : null),
              },
            }
          );
      }

      throw error;
    })
    .then((result): UserCart => {
      const { expand, ...rest } = result;

      return {
        products: expand?.['user_cart_products(cart)'] ?? [],
        ...rest,
      };
    });

  const productsToFetch: string[] = [];
  for (const cartProduct of profileCart.products) {
    productsToFetch.push(
      typeof cartProduct.product === 'string'
        ? cartProduct.product
        : cartProduct.product.id
    );
  }

  if (productsToFetch.length) {
    const { items: productsForCart } = await ProductService.getMany(
      {
        perPage: 99999,
        otherFilters: [
          `( ${productsToFetch.map((id) => `id="${id}"`).join(' || ')} )`,
        ],
      },
      {
        headers: {
          ...(sessionToken ? { [AUTHORIZATION_HEADER]: sessionToken } : null),
        },
      }
    );

    for (const cartProduct of profileCart.products) {
      const productId =
        typeof cartProduct.product === 'string'
          ? cartProduct.product
          : cartProduct.product.id;

      const productFromFetchedProducts = productsForCart.find(
        ({ id }) => id === productId
      );
      // TODO: this may break something - if no product is found then we should remove this from cart
      if (productFromFetchedProducts) {
        cartProduct.product = productFromFetchedProducts;
      }
    }
  }

  const cartResult = profileCart as ReturnType;

  return {
    ...cartResult,
    price: {
      total: cartResult.products.reduce(
        (totalPrice, cartItem) =>
          totalPrice + cartItem.product.price.value * cartItem.count,
        0
      ),
    },
  };
};
