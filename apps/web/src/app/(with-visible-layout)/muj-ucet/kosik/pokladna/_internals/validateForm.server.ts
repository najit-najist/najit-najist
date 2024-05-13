import { logger } from '@najit-najist/api/server';
import { OrderDeliveryMethodsSlug } from '@najit-najist/database/models';
import { validatePoint } from '@najit-najist/packeta';
import { userCartCheckoutInputSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { getPaymentAndDelivery } from './getPaymentAndDelivery.server';

type GetPaymentAndDeliveryReturn = Awaited<
  ReturnType<typeof getPaymentAndDelivery>
>;

export const validateForm = (
  formData: unknown,
  meta: GetPaymentAndDeliveryReturn
) =>
  userCartCheckoutInputSchema
    .superRefine(async (value, ctx) => {
      const { deliveryMethod, paymentMethod } = meta;

      // We dont need to check delivery method now, we attach payment method only to order
      if (!paymentMethod) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vybraný způsob platby neznáme, vyberte jiný',
          fatal: true,
          path: ['paymentMethod.slug'],
        });
      } else if (
        !deliveryMethod ||
        paymentMethod.exceptDeliveryMethods
          .map(
            ({ deliveryMethod: exceptDeliveryMethod }) =>
              exceptDeliveryMethod.slug
          )
          .includes(value.deliveryMethod.slug as OrderDeliveryMethodsSlug)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vybraný způsob dopravy neznáme, vyberte jinou',
          fatal: true,
          path: ['deliveryMethod.slug'],
        });
      }

      if (value.deliveryMethod.slug === OrderDeliveryMethodsSlug.PACKETA) {
        try {
          await validatePoint({
            point: value.deliveryMethod.meta,
          });
        } catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Toto odběrné místo již není dostupné nebo neexistuje, vyberte prosím jiné místo',
            fatal: true,
            path: ['deliveryMethod.meta'],
          });
          logger.error({ error }, 'Failed the validation of pickup point');
        }
      }
    })
    .safeParseAsync(formData);
