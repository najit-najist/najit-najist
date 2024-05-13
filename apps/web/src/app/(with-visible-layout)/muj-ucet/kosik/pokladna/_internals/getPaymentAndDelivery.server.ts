import { database } from '@najit-najist/database';
import { OrderPaymentMethodsSlugs } from '@najit-najist/database/models';

import { FormValues } from './types';

export const getPaymentAndDelivery = async ({
  deliveryMethod: pickedDeliveryMethod,
  paymentMethod: pickedPaymentMethod,
}: Pick<Partial<FormValues>, 'paymentMethod' | 'deliveryMethod'>) => {
  if (!pickedDeliveryMethod?.slug || !pickedPaymentMethod?.slug) {
    return {};
  }

  const [paymentMethod, deliveryMethod] = await Promise.all([
    database.query.orderPaymentMethods.findFirst({
      where: (s, { eq }) =>
        eq(s.slug, pickedPaymentMethod.slug as OrderPaymentMethodsSlugs),
      with: {
        exceptDeliveryMethods: {
          with: {
            deliveryMethod: true,
          },
        },
      },
    }),
    database.query.orderDeliveryMethods.findFirst({
      where: (s, { eq }) => eq(s.slug, pickedDeliveryMethod.slug),
    }),
  ]);

  return { paymentMethod, deliveryMethod };
};
