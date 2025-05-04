import queryString from 'query-string';

import { ComgateError } from './ComgateError';
import { ComgateErrorResponseCode } from './ComgateErrorResponseCode';
import { ComgateGetStatusSuccessResponse } from './ComgateGetStatusSuccessResponse';
import { ComgateNetworkError } from './ComgateNetworkError';
import { ComgateResponseCode } from './ComgateResponseCode';
import { ComgateSuccessResponseCode } from './ComgateSuccessResponseCode';
import { TransactionId } from './TransactionId';

export type CreatePaymentOptions = {
  /** Reference id that this transaction has been created for, usually an order id */
  refId: string;
  amount: number;
  email: string;
  /**
   * If this is true then new payment is first authorized from comgate and then is moved into AUTHORIZED state.
   * After that there is a need for capturing this authorized transaction with 'doPaymentPreauthCapture' method or 'doPaymentPreauthCancel' for canceling the transaction.
   * If this is omitted the verification is done automatically
   */
  preauth?: boolean;
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

  private async doRequest<
    T extends Record<string, any>,
    TErrorCode extends ComgateErrorResponseCode = ComgateErrorResponseCode,
  >(path: string, options?: RequestInit) {
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
      throw new ComgateNetworkError({
        path,
        response,
      });
    }

    const bodyAsString = await response.text();
    const data = queryString.parse(bodyAsString, {
      parseBooleans: true,
      parseNumbers: true,
    }) as T;

    if (data.code !== ComgateSuccessResponseCode.OK) {
      return new ComgateError(data.code as TErrorCode, {
        path,
        response,
        body: data,
      }) as ComgateError<TErrorCode, T>;
    }

    return {
      ...response,
      data,
    };
  }

  public async getPaymentStatus(options: { transId: TransactionId }) {
    const transId = String(options.transId);

    return await this.doRequest<ComgateGetStatusSuccessResponse>('/status', {
      method: 'POST',
      body: new URLSearchParams({
        transId: transId,
      }),
    });
  }

  public async doPaymentCancel(transactionId: TransactionId) {
    return await this.doRequest<
      {
        message: string;
      },
      ComgateErrorResponseCode.INVALID_REQUEST
    >('/cancel', {
      method: 'POST',
      body: new URLSearchParams({
        transId: transactionId,
      }),
    });
  }

  public async doPaymentRefund(
    transactionId: TransactionId,
    refundAmount: number,
  ) {
    return await this.doRequest<
      {
        message: string;
      },
      | ComgateErrorResponseCode.UNKNOWN_ERROR
      | ComgateErrorResponseCode.DB_ERROR
      | ComgateErrorResponseCode.INVALID_REQUEST
      | ComgateErrorResponseCode.PAYMENT_ALREADY_CANCELED
      | ComgateErrorResponseCode.REFUND_TOO_LARGE
      | ComgateErrorResponseCode.UNKNOWN_ERROR
    >('/refund', {
      method: 'POST',
      body: new URLSearchParams({
        transId: transactionId,
        amount: String(refundAmount * 100),
      }),
    });
  }

  public async doPaymentCreate(options: CreatePaymentOptions) {
    const { refId, amount, email } = options;

    return await this.doRequest<{
      message: string;
      transId: TransactionId;
      /**
       * Redirect url that should be sent back to client
       */
      redirect: string;
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

  public async doPaymentPreauthCapture(options: {
    transId: string;
    amount: number;
  }) {
    const { transId, amount } = options;

    return await this.doRequest<{
      message: string;
    }>(`/preauth/transId/${transId}.json`, {
      method: 'PUT',
      body: new URLSearchParams({
        amount: String(amount),
      }),
    });
  }
}
