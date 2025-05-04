import { AbstractPaymentProvider } from '@medusajs/framework/utils';

type Options = {
  apiKey: string;
};

class ComgatePaymentProviderService extends AbstractPaymentProvider<Options> {
  // TODO implement methods
  static identifier = 'comgate-payment';
}

export default ComgatePaymentProviderService;
