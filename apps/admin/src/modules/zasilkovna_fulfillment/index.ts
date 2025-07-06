import { Module, ModuleProvider, Modules } from '@medusajs/framework/utils';

import { ZasilkovnaFulfilmentProviderService } from './service';

export const ZASILKOVNA_FULFILLMENT_PROVIDER_MODULE = 'zasilkovna_fulfillment';

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [ZasilkovnaFulfilmentProviderService],
});
