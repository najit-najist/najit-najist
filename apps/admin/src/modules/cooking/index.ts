import { Module } from '@medusajs/framework/utils';

import { CookingModuleService } from './service';

export const COOKING_MODULE = 'cooking';

export default Module(COOKING_MODULE, {
  service: CookingModuleService,
});
