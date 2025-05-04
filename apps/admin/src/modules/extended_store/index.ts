import { Module } from '@medusajs/framework/utils';

import { ExtendedStoreService } from './service';

export const EXTENDED_STORE_MODULE = 'extended_store';

export default Module(EXTENDED_STORE_MODULE, {
  service: ExtendedStoreService,
});
