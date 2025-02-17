import {
  OrderDeliveryMethod,
  OrderDeliveryMethodsSlug,
} from '@najit-najist/database/models';
import { z } from 'zod';

import { entityLinkSchema } from './entityLinkSchema';
import { nonEmptyStringSchema } from './nonEmptyStringSchema';
import { packetaMetadataSchema } from './packetaMetadataSchema';
import { pickupTimeSchema } from './pickupTimeSchema';
import { streetNameSchema } from './streetNameSchema';
import { telephoneNumberInputSchema } from './telephoneNumberInputSchema';

const MESSAGES = {
  requiredHouseNumber: 'Vyplňte číslo Vašeho baráku',
  requiredCity: 'Vyplňte název města',
  requiredPostalCode: 'Vyplňte PSČ',
};

export const deliveryMethodSchema = z.discriminatedUnion('slug', [
  z.object({
    slug: z.literal(OrderDeliveryMethodsSlug.PACKETA),
    meta: packetaMetadataSchema,
  }),
  z.object({
    slug: z.literal(OrderDeliveryMethodsSlug.LOCAL_PICKUP),
    meta: pickupTimeSchema,
  }),
  z.object({
    slug: z.literal(OrderDeliveryMethodsSlug.BALIKOVNA),
  }),
]);

export const orderAddressSchema = z.object({
  municipality: entityLinkSchema,
  houseNumber: z
    .string({ required_error: MESSAGES.requiredHouseNumber })
    .min(1, MESSAGES.requiredHouseNumber),
  streetName: streetNameSchema,
  city: z
    .string({ required_error: MESSAGES.requiredCity })
    .min(1, MESSAGES.requiredCity),
  postalCode: z
    .string({ required_error: MESSAGES.requiredPostalCode })
    .min(1, MESSAGES.requiredPostalCode),
});

export const userCartCheckoutInputSchema = z.object({
  email: z.string().email(),
  firstName: nonEmptyStringSchema,
  lastName: nonEmptyStringSchema,
  telephoneNumber: telephoneNumberInputSchema.refine(
    (value) => value.length >= 1,
    'Zadejte telefonní číslo',
  ),
  notes: z.string().optional(),
  address: orderAddressSchema,
  invoiceAddress: orderAddressSchema.optional(),
  paymentMethod: z.object({ slug: z.string() }),
  deliveryMethod: deliveryMethodSchema,
  businessInformations: z
    .object({
      ico: z.string().min(1, 'Vyplňte prosím vaše IČO'),
      dic: z.string().nullish(),
    })
    .optional(),
});
