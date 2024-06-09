import { Coupon } from '@najit-najist/database/models';

export const isCouponExpired = (coupon: Coupon) => {
  if (!coupon.validFrom && !coupon.validTo) {
    return false;
  }
  const today = new Date().getTime();

  return (
    (coupon.validFrom && today < coupon.validFrom.getTime()) ||
    (coupon.validTo && today > coupon.validTo.getTime())
  );
};
