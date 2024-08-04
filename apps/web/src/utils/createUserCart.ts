import { database } from '@najit-najist/database';
import { userCarts } from '@najit-najist/database/models';

import { getUserCart, ProductFromCart } from './getUserCart';

export const createUserCart = async (initialValue: {
  userId?: number;
}): Promise<NonNullable<Awaited<ReturnType<typeof getUserCart>>>> => {
  const [createdCart] = await database
    .insert(userCarts)
    .values(initialValue)
    .returning();

  return {
    ...createdCart,
    canApplyCoupon: false,
    discount: 0,
    discountedProductCount: 0,
    subtotal: 0,
    products: [] as ProductFromCart[],
    coupon: null,
    couponId: null,
  };
};
