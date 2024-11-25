import { ComgateClient } from '@najit-najist/comgate';

const appOrigin = process.env.APP_ORIGIN ?? 'https://najitnajist.cz';

export const comgateClient = new ComgateClient({
  merchant: {
    id: process.env.COMGATE_MERCHANT_ID ?? '',
  },
  secret: process.env.COMGATE_SECRET ?? '',
  returnUrls: {
    paid: ({ refId }) => `${appOrigin}/orders/payments/${refId}/paid`,
    cancelled: ({ refId }) => `${appOrigin}/orders/payments/${refId}/cancelled`,
    pending: ({ refId }) => `${appOrigin}/orders/payments/${refId}/pending`,
  },
});
