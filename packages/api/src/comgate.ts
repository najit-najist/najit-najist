import { Order } from '@najit-najist/database/models';
import queryString from 'query-string';

import { config } from './config';
import { logger } from './logger';

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

export enum ComgateResponseCode {
  'OK' = 0,
  UNKNOWN_ERROR = 1100, // neznámá chyba
  UNSUPPORTED_LANGUAGE = 1102, // zadaný jazyk není podporován
  INVALID_PARAM = 1103, // nesprávně zadaná metoda
  CANNOT_LOAD_PAYMENT = 1104, // nelze načíst platbu
  PRICE_NOT_SUPPORTED = 1107, // cena platby není podporovaná
  DB_ERROR = 1200, // databázová chyba
  UNKNOWN_ESHOP = 1301, // neznámý e-shop
  CONNECTION_OR_LANGUAGE_MISSING = 1303, // propojení nebo jazyk chybí
  UNKNOWN_CATEGORY = 1304, // neplatná kategorie
  MISSING_DESCRIPTION = 1305, // chybí popis produktu
  CHOOSE_CORRECT_METHOD = 1306, // vyberte správnou metodu
  PAYMENT_TYPE_NOT_SUPPORTED = 1308, // vybraný způsob platby není povolen
  UNKNOWN_PRICE = 1309, // nesprávná částka
  UNKNOWN_CURRENCY = 1310, // neznámá měna
  UNKNOWN_BANK_ACCOUNT_ID = 1311, // neplatný identifikátor bankovního účtu Klienta
  RECURRING_DISABLED = 1316, // e-shop nemá povolené opakované platby
  RECURRING_UNSUPPORTED_FOR_METHOD = 1317, // neplatná metoda – nepodporuje opakované platby
  BANK_ERROR = 1319, // nelze založit platbu, problém na straně banky
  INVALID_RESPONSE_FROM_DB = 1399, // neočekávaný výsledek z databáze
  INVALID_REQUEST = 1400, // chybný dotaz
  SERVER_ERROR = 1500, // 1500 neočekávaná chyba
}

export enum ComgateOrderState {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  AUTHORIZED = 'AUTHORIZED',
}

export type ComgateLikeResponse<T extends Record<string, any>> = T & {
  code: ComgateResponseCode;
};

type GetStatusOptions = {
  transId: string;
};

type GetStatusSuccessResponse = {
  code: ComgateResponseCode.OK;
  message: string;
  merchant: string;
  status: ComgateOrderState;
};

export const isComgateStatusSuccessfulRequest = (
  val: any
): val is GetStatusSuccessResponse => val.code === ComgateResponseCode.OK;

export class Comgate {
  private static merchantId = process.env.COMGATE_MERCHANT_ID;
  private static secret = process.env.COMGATE_SECRET;

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
      logger.error(response, `Failed request to Comgate on path ${path}`);

      throw new Error('Failed to do request to comgate');
    }

    const bodyAsString = await response.text();
    const data = queryString.parse(bodyAsString, {
      parseBooleans: true,
      parseNumbers: true,
    }) as ComgateLikeResponse<T>;

    if (data.code !== ComgateResponseCode.OK) {
      logger.error(
        {
          ...response,
          data,
        },
        `Comgate request failed ${path}`
      );

      throw new Error('Comgate request failed');
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
      | GetStatusSuccessResponse
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

        url_paid: `${config.app.origin}/orders/payments/${refId}/paid`,
        url_cancelled: `${config.app.origin}/orders/payments/${refId}/cancelled`,
        url_pending: `${config.app.origin}/orders/payments/${refId}/pending`,
      }),
    });
  }
}
