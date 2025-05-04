/**
 * Represents a transaction in the Comgate system.
 */
export type ComgateWebhookData = {
  /**
   * Unique transaction ID.
   */
  transId: string;

  /**
   * E-shop identifier in the Comgate system.
   */
  merchant: string;

  /**
   * `true` for test payment, `false` for production.
   */
  test: boolean;

  /**
   * Product price in cents or pence.
   */
  price: number;

  /**
   * Currency code according to ISO 4217.
   */
  curr: string;

  /**
   * Short product description (1-16 characters).
   */
  label: string;

  /**
   * Payment reference (e.g., variable symbol or order number).
   */
  refId: string;

  /**
   * Payer identifier in the e-shop system.
   */
  payerId?: string;

  /**
   * Payer account name.
   */
  payerName?: string;

  /**
   * Payer account number.
   */
  payerAcc?: string;

  /**
   * Payment method used.
   */
  method?: string;

  /**
   * E-shop's bank account identifier.
   */
  account?: string;

  /**
   * Payer's contact email.
   */
  email: string;

  /**
   * Payer's contact phone.
   */
  phone?: string;

  /**
   * Product identifier for statistics.
   */
  name?: string;

  /**
   * Security key for communication.
   */
  secret: string;

  /**
   * Current transaction status.
   * Possible values: `PAID`, `CANCELLED`, `AUTHORIZED`.
   */
  status: 'PAID' | 'CANCELLED' | 'AUTHORIZED';

  /**
   * Transaction fee (if applicable).
   */
  fee?: string;

  /**
   * Payer's full name.
   */
  fullName: string;

  /**
   * Billing address - city.
   */
  billingAddrCity?: string;

  /**
   * Billing address - street.
   */
  billingAddrStreet?: string;

  /**
   * Billing address - postal code.
   */
  billingAddrPostalCode?: string;

  /**
   * Billing address - country (ISO 3166 alpha-2).
   */
  billingAddrCountry?: string;

  /**
   * Delivery method.
   * Possible values: `HOME_DELIVERY`, `PICKUP`, `ELECTRONIC_DELIVERY`.
   */
  delivery?: 'HOME_DELIVERY' | 'PICKUP' | 'ELECTRONIC_DELIVERY';

  /**
   * Delivery address - city.
   */
  homeDeliveryCity?: string;

  /**
   * Delivery address - street.
   */
  homeDeliveryStreet?: string;

  /**
   * Delivery address - postal code.
   */
  homeDeliveryPostalCode?: string;

  /**
   * Delivery address - country (ISO 3166 alpha-2).
   */
  homeDeliveryCountry?: string;

  /**
   * Product category.
   * Possible values: `PHYSICAL_GOODS_ONLY`, `OTHER`.
   */
  category?: 'PHYSICAL_GOODS_ONLY' | 'OTHER';

  /**
   * Surcharge amount for non-regulated card types.
   */
  appliedFee?: number;

  /**
   * Surcharge type.
   * Possible values: `EU_UNREGULATED`, `NON_EU_BUSINESS`, `NON_EU_CONSUMER`, `EU_CONSUMER`.
   */
  appliedFeeType?:
    | 'EU_UNREGULATED'
    | 'NON_EU_BUSINESS'
    | 'NON_EU_CONSUMER'
    | 'EU_CONSUMER';
};
