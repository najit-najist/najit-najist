import { relations } from 'drizzle-orm';

import { orderDeliveryMethods } from './orderDeliveryMethods';
import { productsToDeliveryMethods } from './productsToDeliveryMethods';

export const orderDeliveryMethodsRelations = relations(
  orderDeliveryMethods,
  ({ many }) => ({
    exclusivelySelectedForProducts: many(productsToDeliveryMethods),
  }),
);
