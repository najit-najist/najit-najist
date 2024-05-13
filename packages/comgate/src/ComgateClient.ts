import { Order } from '@najit-najist/database/models';
import queryString from 'query-string';

import { ComgateGetStatusSuccessResponse } from './ComgateGetStatusSuccessResponse';
import { ComgateRequestError } from './ComgateRequestError';
import { ComgateResponseCode } from './ComgateResponseCode';

export type CreatePaymentOptions = {
  order: Pick<
    Order,
    'subtotal' | 'deliveryMethodPrice' | 'paymentMethodPrice' | 'email' | 'id'
  >;
};

export const getTotalPrice = (
  order: Pick<Order, 'subtotal' | 'deliveryMethodPrice' | 'paymentMethodPrice'>
) => {
  return (
    order.subtotal +
    (order.deliveryMethodPrice ?? 0) +
    (order.paymentMethodPrice ?? 0)
  );
};

export type ComgateLikeResponse<T extends Record<string, any>> = T & {
  code: ComgateResponseCode;
};

type GetStatusOptions = {
  transId: string;
};

export class ComgateClient {
  private static merchantId = process.env.COMGATE_MERCHANT_ID;
  private static secret = process.env.COMGATE_SECRET;
  private static appOrigin = process.env.APP_ORIGIN ?? 'https://najitnajist.cz';

  private static async doRequest<T extends Record<string, any>>(
    path: string,
    options?: RequestInit
  ) {
    if (!this.merchantId || !this.secret) {
      throw new Error('Missing merchantId or server');
    }

    if (options?.body instanceof URLSearchParams) {
      options.body.set('merchant', this.merchantId);
      options.body.set('secret', this.secret);
    }

    options ??= {};
    options.headers ??= {};
    (options.headers as any)['Content-Type'] =
      'application/x-www-form-urlencoded';

    const response = await fetch(
      new URL(`/v1.0${path}`, 'https://payments.comgate.cz'),
      options
    );

    if (response.status !== 200) {
      throw new ComgateRequestError('http-failed', path, response);
    }

    const bodyAsString = await response.text();
    const data = queryString.parse(bodyAsString, {
      parseBooleans: true,
      parseNumbers: true,
    }) as ComgateLikeResponse<T>;

    if (data.code !== ComgateResponseCode.OK) {
      throw new ComgateRequestError('payload-not-ok', path, response, data);
    }

    return {
      ...response,
      ...(data.code !== ComgateResponseCode.OK ? { status: 400 } : {}),
      data,
    };
  }

  public static async getStatus(options: GetStatusOptions) {
    const transId = String(options.transId);

    return await this.doRequest<
      | ComgateGetStatusSuccessResponse
      | {
          code: ComgateResponseCode;
          message: string;
        }
    >('/status', {
      method: 'POST',
      body: new URLSearchParams({
        transId: transId,
      }),
    });
  }

  public static async createPayment(options: CreatePaymentOptions) {
    const refId = String(options.order.id);

    return await this.doRequest<{
      message: string;
      transId?: string;
      /**
       * Redirect url that should be sent back to client
       */
      redirect?: string;
    }>('/create', {
      method: 'POST',
      body: new URLSearchParams({
        test: String(process.env.NODE_ENV !== 'production'),
        country: 'CZ',
        curr: 'CZK',
        price: String(getTotalPrice(options.order) * 100),
        refId,
        email: options.order.email,
        prepareOnly: String(true),
        label: 'Eshop objednávka',
        method: 'ALL',

        url_paid: `${this.appOrigin}/orders/payments/${refId}/paid`,
        url_cancelled: `${this.appOrigin}/orders/payments/${refId}/cancelled`,
        url_pending: `${this.appOrigin}/orders/payments/${refId}/pending`,
      }),
    });
  }
}
