import { relations } from 'drizzle-orm';

import { orderDeliveryMethods } from './orderDeliveryMethods';
import { products } from './products';
import { productsToDeliveryMethods } from './productsToDeliveryMethods';

export const productToDeliveryMethodsRelations = relations(
  productsToDeliveryMethods,
  ({ one }) => ({
    product: one(products, {
      references: [products.id],
      fields: [productsToDeliveryMethods.productId],
    }),
    deliveryMethod: one(orderDeliveryMethods, {
      references: [orderDeliveryMethods.id],
      fields: [productsToDeliveryMethods.deliveryMethodId],
    }),
  }),
);
