import {
  AbstractPaymentProvider,
  MedusaError,
} from '@medusajs/framework/utils';
import { Logger } from '@medusajs/medusa';
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from '@medusajs/types';
import {
  ComgateClient,
  ComgateError,
  ComgateOrderState,
  ComgateWebhookData,
} from '@najit-najist/comgate';

type Options = {
  secret: string;
  merchantId: string;
  siteOrigin: string;
};

type InjectedDependencies = {
  logger: Logger;
};

export class ComgatePaymentProviderService extends AbstractPaymentProvider<Options> {
  // TODO implement methods
  static identifier = 'comgate-payment';
  protected logger_: Logger;
  protected options_: Options;
  // assuming you're initializing a client
  protected client: ComgateClient;

  static validateOptions(options: Record<any, any>): void | never {
    if (!options.secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "API key is required in the provider's options.",
      );
    }
  }

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options);

    this.logger_ = container.logger;
    this.options_ = options;

    this.client = new ComgateClient({
      merchant: {
        id: options.merchantId,
      },
      secret: options.secret,
      returnUrls: {
        paid: ({ refId }) =>
          new URL(
            `/orders/payments/${refId}/paid`,
            options.siteOrigin,
          ).toString(),
        cancelled: ({ refId }) =>
          new URL(
            `/orders/payments/${refId}/cancelled`,
            options.siteOrigin,
          ).toString(),
        pending: ({ refId }) =>
          new URL(
            `/orders/payments/${refId}/pending`,
            options.siteOrigin,
          ).toString(),
      },
    });
  }

  async capturePayment(
    input: CapturePaymentInput,
  ): Promise<CapturePaymentOutput> {
    const externalId = input.data?.id;

    const comgateResponse = await this.client.doPaymentPreauthCapture({
      transId: externalId,
      amount: input.data.amount,
    });

    if (comgateResponse instanceof ComgateError) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        'Platba nemohla být zachycena',
      );
    }

    return {
      data: comgateResponse.data,
    };
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return {};
  }

  async authorizePayment(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput> {
    const externalId = input.data?.id;

    const comgateResponse = await this.client.getPaymentStatus({
      transId: externalId,
    });

    if (comgateResponse instanceof ComgateError) {
      return {
        status: 'error',
        data: comgateResponse.options.body,
      };
    }

    switch (comgateResponse.data.status) {
      case ComgateOrderState.AUTHORIZED:
        return { status: 'authorized', data: comgateResponse.data };
      case ComgateOrderState.PAID:
        return { status: 'captured', data: comgateResponse.data };
      case ComgateOrderState.CANCELLED:
        return { status: 'canceled', data: comgateResponse.data };
      default:
        return { status: 'pending', data: comgateResponse.data };
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput,
  ): Promise<RetrievePaymentOutput> {
    const externalId = input.data?.id;

    const comgateResponse = await this.client.getPaymentStatus({
      transId: externalId,
    });

    if (comgateResponse instanceof ComgateError) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        'Platba nemohla být zrušena',
      );
    }

    return { data: comgateResponse.data };
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    const externalId = input.data?.id;

    const comgateResponse = await this.client.doPaymentCancel(externalId);

    if (comgateResponse instanceof ComgateError) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        'Platba nemohla být zrušena',
      );
    }

    return { data: comgateResponse.data };
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const externalId = input.data?.transactionId;

    // assuming you have a client that cancels the payment
    const comgateResponse = await this.client.doPaymentCancel(externalId);

    if (comgateResponse instanceof ComgateError) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_REQUIRES_MORE_ERROR,
        'Platba nemohla být zrušena',
      );
    }

    return { data: comgateResponse.data };
  }

  async initiatePayment({
    amount,
    currency_code,
    context,
    data,
  }: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { order } = data ?? {};

    if (!order) {
      throw new Error('Missing order id');
    }

    const comgateResponse = await this.client.doPaymentCreate({
      amount,
      email: context?.customer?.email,
      refId: order.id,
      preauth: true,
    });

    if (comgateResponse instanceof ComgateError) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_REQUIRES_MORE_ERROR,
        'Platba nemohla být vytvořena',
      );
    }

    const { data: comgateData } = comgateResponse;

    return {
      id: comgateData.transId,
      data: comgateData,
    };
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput,
  ): Promise<GetPaymentStatusOutput> {
    const externalId = input.data?.id;

    const comgateResponse = await this.client.getPaymentStatus({
      transId: externalId,
    });

    if (comgateResponse instanceof ComgateError) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        'Status platby nemohl být zjištěn',
      );
    }

    const { data } = comgateResponse;

    switch (data.status) {
      case ComgateOrderState.AUTHORIZED:
        return { status: 'authorized' };
      case ComgateOrderState.PAID:
        return { status: 'captured' };
      case ComgateOrderState.CANCELLED:
        return { status: 'canceled' };
      default:
        return { status: 'pending' };
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const externalId = input.data?.id;
    const comgateResponse = await this.client.doPaymentRefund(
      externalId,
      input.amount,
    );

    if (comgateResponse instanceof ComgateError) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        'Platba nemohla být vrácena',
      );
    }

    return {
      data: comgateResponse.data,
    };
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload['payload'],
  ): Promise<WebhookActionResult> {
    const { data: untypedData, rawData, headers } = payload;

    // TODO: Call status before this to know if its valid

    const data = untypedData as ComgateWebhookData;

    try {
      switch (data.status) {
        case 'AUTHORIZED':
          return {
            action: 'authorized',
            data: {
              session_id: data.transId,
              amount: new BigNumber(data.price),
            },
          };
        case 'PAID':
          return {
            action: 'captured',
            data: {
              session_id: data.transId,
              amount: new BigNumber(data.price),
            },
          };
        default:
          return {
            action: 'not_supported',
          };
      }
    } catch (e) {
      return {
        action: 'failed',
        data: {
          session_id: data.transId,
          amount: new BigNumber(data.price as number),
        },
      };
    }
  }
}
