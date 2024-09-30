import {
  CouponPatch,
  Product,
  UserCartProduct,
  OrderedProduct,
  Coupon,
  CouponForProduct,
  CouponsForProductCategory,
} from '@najit-najist/database/models';

export const getCartItemPrice = (
  product: (UserCartProduct | OrderedProduct) & {
    product: Product;
  },
  coupon?: Coupon & {
    onlyForProducts: CouponForProduct[];
    onlyForProductCategories: CouponsForProductCategory[];
    patches: CouponPatch[];
  },
) => {
  const totalPrice = product.count * (product.product?.price ?? 0);
  let discount = 0;

  if (coupon) {
    const shouldBeGrouped =
      !!coupon.onlyForProducts.length ||
      !!coupon.onlyForProductCategories.length;
    const belongsToGroup =
      coupon?.onlyForProducts.some(
        ({ productId }) => product.product.id === productId,
      ) ||
      coupon?.onlyForProductCategories.some(
        ({ categoryId }) => product.product.categoryId === categoryId,
      );
    const couponPatch = coupon?.patches.at(0);

    if (shouldBeGrouped && belongsToGroup && couponPatch?.reductionPercentage) {
      discount = (totalPrice / 100) * couponPatch?.reductionPercentage;
    }
  }

  return {
    value: totalPrice,
    discount: Math.round(discount),
  };
};
