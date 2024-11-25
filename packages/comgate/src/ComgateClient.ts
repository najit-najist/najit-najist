import queryString from 'query-string';

import { ComgateGetStatusSuccessResponse } from './ComgateGetStatusSuccessResponse';
import { ComgateRequestError } from './ComgateRequestError';
import { ComgateResponseCode } from './ComgateResponseCode';
import { TransactionId } from './TransactionId';

export type CreatePaymentOptions = {
  /** Reference id that this transaction has been created for, usually an order id */
  refId: string;
  amount: number;
  email: string;
};

export type ComgateLikeResponse<T extends Record<string, any>> = T & {
  code: ComgateResponseCode;
};

export type ComgateClientConfiguration = {
  merchant: { id: string };
  secret: string;
  /** Return urls for payments */
  returnUrls: {
    /** Url to sent user to after it was paid */
    paid: (options: { refId: string }) => string;
    /** Url to sent user to after it was cancelled */
    cancelled: (options: { refId: string }) => string;
    /** Url to sent user to when the payment started */
    pending: (options: { refId: string }) => string;
  };
};

export class ComgateClient {
  private readonly configuration: ComgateClientConfiguration;

  constructor(configuration: ComgateClientConfiguration) {
    if (!configuration.merchant.id || !configuration.secret) {
      throw new Error('Missing merchantId or server secret');
    }

    this.configuration = configuration;
  }

  private async doRequest<T extends Record<string, any>>(
    path: string,
    options?: RequestInit,
  ) {
    if (options?.body instanceof URLSearchParams) {
      options.body.set('merchant', this.configuration.merchant.id);
      options.body.set('secret', this.configuration.secret);

      if (process.env.NODE_ENV === 'development') {
        options.body.set('test', 'true');
      }
    }

    options ??= {};
    options.headers ??= {};
    (options.headers as any)['Content-Type'] =
      'application/x-www-form-urlencoded';

    const response = await fetch(
      new URL(`/v1.0${path}`, 'https://payments.comgate.cz'),
      options,
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

  public async getStatus(options: { transId: TransactionId }) {
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

  public async cancelPayment(transactionId: TransactionId) {
    return await this.doRequest<{
      code: ComgateResponseCode.OK | ComgateResponseCode.INVALID_REQUEST;
      message: string;
    }>('/cancel', {
      method: 'POST',
      body: new URLSearchParams({
        transId: transactionId,
      }),
    });
  }

  public async refundPayment(
    transactionId: TransactionId,
    refundAmount: number,
  ) {
    return await this.doRequest<{
      code:
        | ComgateResponseCode.OK
        | ComgateResponseCode.UNKNOWN_ERROR
        | ComgateResponseCode.DB_ERROR
        | ComgateResponseCode.INVALID_REQUEST
        | ComgateResponseCode.PAYMENT_ALREADY_CANCELED
        | ComgateResponseCode.REFUND_TOO_LARGE
        | ComgateResponseCode.UNKNOWN_ERROR;
      message: string;
    }>('/refund', {
      method: 'POST',
      body: new URLSearchParams({
        transId: transactionId,
        amount: String(refundAmount * 100),
      }),
    });
  }

  public async createPayment(options: CreatePaymentOptions) {
    const { refId, amount, email } = options;

    return await this.doRequest<{
      message: string;
      transId?: TransactionId;
      /**
       * Redirect url that should be sent back to client
       */
      redirect?: string;
    }>('/create', {
      method: 'POST',
      body: new URLSearchParams({
        country: 'CZ',
        curr: 'CZK',
        price: String(amount * 100),
        refId,
        email,
        prepareOnly: String(true),
        label: 'Eshop objednávka',
        method: 'ALL',
        url_paid: this.configuration.returnUrls.paid({ refId }),
        url_cancelled: this.configuration.returnUrls.cancelled({ refId }),
        url_pending: this.configuration.returnUrls.pending({ refId }),
      }),
    });
  }
}
