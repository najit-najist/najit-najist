import { Module } from '@medusajs/framework/utils';

import { ExtendedStoreService } from './service';

export const EXTENDED_STORE_MODULE = 'extended_store';

const ExtendedStoreModule = Module(EXTENDED_STORE_MODULE, {
  service: ExtendedStoreService,
});

export default ExtendedStoreModule;
