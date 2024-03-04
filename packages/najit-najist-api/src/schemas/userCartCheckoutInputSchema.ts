import {
  nonEmptyStringSchema,
  streetNameSchema,
  telephoneNumberInputSchema,
} from '@najit-najist/schemas';
import { z } from 'zod';

import { entityLinkSchema } from './entityLinkSchema';

const MESSAGES = {
  requiredHouseNumber: 'Vyplňte číslo Vašeho baráku',
  requiredCity: 'Vyplňte název města',
  requiredPostalCode: 'Vyplňte PSČ',
};

export const userCartCheckoutInputSchema = z.object({
  email: z.string().email(),
  firstName: nonEmptyStringSchema,
  lastName: nonEmptyStringSchema,
  telephoneNumber: telephoneNumberInputSchema.refine(
    (value) => value.length >= 1,
    'Zadejte telefonní číslo'
  ),
  address: z.object({
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
  }),
  saveAddressToAccount: z.boolean().default(false),
  paymentMethod: entityLinkSchema,
  deliveryMethod: entityLinkSchema,
});
