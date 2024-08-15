import { relations } from 'drizzle-orm';
import { integer, pgTable, serial } from 'drizzle-orm/pg-core';

import { productAlergens } from './productAlergens';
import { products } from './products';

export const productAlergensToProducts = pgTable(
  'product_alergens_to_products',
  {
    id: serial('id').primaryKey(),
    alergenId: integer('alergen_id')
      .references(() => productAlergens.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    productId: integer('product_id')
      .references(() => products.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
);

export const productAlergensToProductsRelations = relations(
  productAlergensToProducts,
  ({ one }) => ({
    alergen: one(productAlergens, {
      fields: [productAlergensToProducts.alergenId],
      references: [productAlergens.id],
    }),
    product: one(products, {
      fields: [productAlergensToProducts.productId],
      references: [products.id],
    }),
  }),
);
