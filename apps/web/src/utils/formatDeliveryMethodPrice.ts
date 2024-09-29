const DISCOUNT_AFTER_SUBTOTAL = 1500;
export const formatDeliveryMethodPrice = (
  deliveryPrice: number,
  orderMeta: { subtotal: number },
) => ({
  original: deliveryPrice,
  formatted: orderMeta.subtotal >= DISCOUNT_AFTER_SUBTOTAL ? 0 : deliveryPrice,
});

formatDeliveryMethodPrice.limit = DISCOUNT_AFTER_SUBTOTAL;
