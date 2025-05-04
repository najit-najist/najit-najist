import { defineLink } from '@medusajs/framework/utils';
import ProductModule from '@medusajs/medusa/product';

import ExtendedStoreModule from '../modules/extended_store';

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  {
    linkable: ExtendedStoreModule.linkable.productAlergen,
    isList: true,
  },
  {
    database: {
      table: 'product_alergen_to_product',
    },
  },
);
