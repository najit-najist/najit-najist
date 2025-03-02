import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import {
  OrderDeliveryMethodsSlug,
  OrderPaymentMethodsSlugs,
} from '@najit-najist/database/models';
import { validatePoint } from '@najit-najist/packeta';
import {
  deliveryMethodSchema,
  userCartCheckoutInputSchema,
} from '@najit-najist/schemas';
import { z } from 'zod';

export const checkoutCartSchemaServer = userCartCheckoutInputSchema
  .extend({
    deliveryMethod: deliveryMethodSchema.transform(async (original) => ({
      original,
      fetched: await database.query.orderDeliveryMethods.findFirst({
        where: (s, { eq }) => eq(s.slug, original.slug),
      }),
    })),
    paymentMethod: z.object({ slug: z.string() }).transform(({ slug }) =>
      database.query.orderPaymentMethods.findFirst({
        where: (s, { eq }) => eq(s.slug, slug as OrderPaymentMethodsSlugs),
        with: {
          exceptDeliveryMethods: {
            with: {
              deliveryMethod: true,
            },
          },
        },
      }),
    ),
  })
  .superRefine(async (value, ctx) => {
    // We dont need to check delivery method now, we attach payment method only to order
    if (!value.paymentMethod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vybraný způsob platby neznáme, vyberte jiný',
        fatal: true,
        path: ['paymentMethod.slug'],
      });
    } else if (
      !value.deliveryMethod.fetched ||
      value.paymentMethod.exceptDeliveryMethods
        .map(
          ({ deliveryMethod: exceptDeliveryMethod }) =>
            exceptDeliveryMethod.slug,
        )
        .includes(
          value.deliveryMethod.fetched!.slug as OrderDeliveryMethodsSlug,
        )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vybraný způsob dopravy neznáme, vyberte jinou',
        fatal: true,
        path: ['deliveryMethod.slug'],
      });
    }

    if (
      value.deliveryMethod.original.slug === OrderDeliveryMethodsSlug.PACKETA
    ) {
      try {
        await validatePoint({
          point: value.deliveryMethod.original.meta,
        });
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Toto odběrné místo již není dostupné nebo neexistuje, vyberte prosím jiné místo',
          fatal: true,
          path: ['deliveryMethod.meta'],
        });
        logger.error('[CHECKOUT] pickup point validation failed', {
          error,
        });
      }
    }

    if (
      value.deliveryMethod.fetched?.slug ===
        OrderDeliveryMethodsSlug.DELIVERY_HRADEC_KRALOVE &&
      value.address.municipality.slug !== 'hradec-kralove'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Pro dopravu kurýrem musíte mít dodací adresu v Hradci Králové',
        fatal: true,
        path: ['address.municipality'],
      });
    }
  });
