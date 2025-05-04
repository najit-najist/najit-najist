import { defineLink } from '@medusajs/framework/utils';
import ProductModule from '@medusajs/medusa/product';

import ExtendedStoreModule from '../modules/extended_store';

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  ExtendedStoreModule.linkable.productBrand,
  {
    database: {
      table: 'product_brand_to_product',
    },
  },
);
