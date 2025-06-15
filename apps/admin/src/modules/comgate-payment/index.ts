import { ModuleProvider, Modules } from '@medusajs/framework/utils';

import { ComgatePaymentProviderService } from './service';

export default ModuleProvider(Modules.PAYMENT, {
  services: [ComgatePaymentProviderService],
});
