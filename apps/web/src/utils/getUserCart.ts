import { database } from '@najit-najist/database';
import { asc } from '@najit-najist/database/drizzle';
import { orderedProducts, userCarts } from '@najit-najist/database/models';
import { EntityLink } from '@najit-najist/schemas';

import { getCartItemPrice } from './getCartItemPrice';

export const getUserCart = async (user: EntityLink) => {
  let cart = await database.query.userCarts.findFirst({
    where: (schema, { eq }) => eq(schema.userId, user.id),
    with: {
      products: {
        orderBy: [asc(orderedProducts.createdAt)],
        with: {
          product: {
            with: {
              price: true,
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
    const [createdCart] = await database
      .insert(userCarts)
      .values({ userId: user.id })
      .returning();

    cart = {
      ...createdCart,
      products: [],
      coupon: null,
      couponId: null,
    };
  }

  let subtotal = 0;
  const discountPatch = cart.coupon?.patches[0];
  let totalDiscount = discountPatch?.reductionPrice ?? 0;

  for (const cartItem of cart.products) {
    const { discount: discountForItem, value: priceForItem } = getCartItemPrice(
      cartItem,
      cart.coupon ?? undefined
    );

    subtotal += priceForItem;
    totalDiscount += discountForItem;
  }

  if (
    !cart.coupon?.onlyForProductCategories.length &&
    !cart.coupon?.onlyForProducts.length &&
    discountPatch?.reductionPercentage
  ) {
    totalDiscount += Math.round(
      (subtotal / 100) * discountPatch?.reductionPercentage
    );
  }

  // TODO: deselect items from cart if user is not eligible
  return { ...cart, subtotal, discount: totalDiscount };
};
