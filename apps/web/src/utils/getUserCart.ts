import { database } from '@najit-najist/database';
import { asc } from '@najit-najist/database/drizzle';
import { orderedProducts, userCarts } from '@najit-najist/database/models';
import { EntityLink } from '@najit-najist/schemas';

import { getCartItemPrice } from './getCartItemPrice';

export type ProductFromCart = NonNullable<
  Awaited<ReturnType<typeof getUserCart>>
>['products'][number];

export type GetUserCartOptions = {
  type: 'user' | 'cart';
  value: EntityLink['id'];
};

export type GetUserCartOutput = Awaited<ReturnType<typeof getUserCart>>;

export const getUserCart = async (options: GetUserCartOptions) => {
  let cart = await database.query.userCarts.findFirst({
    where: (schema, { eq }) =>
      options.type === 'cart'
        ? eq(schema.id, options.value)
        : eq(schema.userId, options.value),
    with: {
      products: {
        orderBy: [asc(orderedProducts.createdAt)],
        with: {
          product: {
            with: {
              stock: true,
              images: true,
              category: true,
              onlyForDeliveryMethod: true,
            },
          },
        },
      },
      coupon: {
        with: {
          patches: {
            limit: 1,
            orderBy: (schema, { desc }) => desc(schema.createdAt),
          },
          onlyForProductCategories: true,
          onlyForProducts: true,
        },
      },
    },
  });

  if (!cart) {
    return null;
  }

  const discountPatch = cart.coupon?.patches[0];

  let subtotal = 0;
  let totalDiscount = discountPatch?.reductionPrice ?? 0;
  const hasPickyCoupon =
    !!cart.coupon?.onlyForProductCategories.length ||
    !!cart.coupon?.onlyForProducts.length;
  let discountedProductCount = hasPickyCoupon
    ? 0
    : cart.products.reduce((total, { count }) => total + count, 0);

  const products = cart.products.map((cartItem) => {
    const { discount: discountForItem, value: batchedPrice } = getCartItemPrice(
      cartItem,
      cart.coupon ?? undefined,
    );

    subtotal += batchedPrice;
    totalDiscount += discountForItem;

    if (discountForItem || !hasPickyCoupon) {
      discountedProductCount += cartItem.count;
    }

    return {
      ...cartItem,
      /**
       * Batched price for all count of this product
       */
      price: batchedPrice,
      /**
       * Discount applied to batched price.
       * If empty then it either means that coupon was not applied or coupon is made for overall price instead
       */
      discount: discountForItem,
    };
  });

  const canApplyCoupon =
    !cart.coupon?.minimalProductCount ||
    cart.coupon.minimalProductCount <= discountedProductCount;

  if (!hasPickyCoupon && discountPatch?.reductionPercentage) {
    totalDiscount += Math.round(
      (subtotal / 100) * discountPatch?.reductionPercentage,
    );
  }

  if (!canApplyCoupon) {
    totalDiscount = 0;
    products.map((item) => {
      item.discount = 0;
      return item;
    });
  }

  // TODO: deselect items from cart if user is not eligible
  return {
    ...cart,
    products,
    subtotal,
    discount: totalDiscount,
    discountedProductCount,
    canApplyCoupon,
  };
};
