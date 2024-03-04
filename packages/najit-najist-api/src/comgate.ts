import queryString from 'query-string';

import { Order } from './schemas/orders';
import { logger } from './server';

export type CreatePaymentOptions = {
  order: Pick<
    Order,
    | 'subtotal'
    | 'delivery_method_price'
    | 'payment_method_price'
    | 'email'
    | 'id'
  >;
};

export const getTotalPrice = (
  order: Pick<
    Order,
    'subtotal' | 'delivery_method_price' | 'payment_method_price'
  >
) => {
  return (
    order.subtotal + order.delivery_method_price + order.payment_method_price
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

export type ComgateLikeResponse<T extends Record<string, any>> = T & {
  code: ComgateResponseCode;
};

export class Comgate {
  private static merchantId = process.env.COMGATE_MERCHANT_ID;
  private static secret = process.env.COMGATE_SECRET;

  private static async doRequest<T extends Record<string, any>>(
    path: string,
    options?: RequestInit
  ) {
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

  public static async createPayment(options: CreatePaymentOptions) {
    if (!this.merchantId || !this.secret) {
      throw new Error('Missing merchantId or server');
    }

    return await this.doRequest<{
      message: string;
      transId?: string;
      /**
       * Redirect url that should be sent back to client
       */
      redirect?: string;
    }>('/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        test: String(process.env.NODE_ENV !== 'production'),
        merchant: this.merchantId,
        country: 'CZ',
        curr: 'CZK',
        price: String(getTotalPrice(options.order) * 100),
        refId: options.order.id,
        email: options.order.email,
        secret: this.secret,
        prepareOnly: String(true),
        label: 'Eshop objednávka',
        method: 'ALL',

        // url_paid	 ‘https://www.example.com/result.php?id=${id}&refId=${refId}’
        // url_cancelled‘https://www.example.com/result.php?id=${id}&refId=${refId}’
        // url_pending
      }),
    });
  }
}
