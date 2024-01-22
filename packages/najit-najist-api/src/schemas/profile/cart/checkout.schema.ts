import { z } from 'zod';

import { addressStreetNameSchema } from '../../address.schema';
import { municipalitySchema } from '../../municipality.schema';
import {
  orderDeliveryMethodSchema,
  orderPaymentMethodSchema,
} from '../../orders';
import { userSchema } from '../../user.schema';
import { zodTelephoneNumber } from '../../zodTelephoneNumber';

const MESSAGES = {
  requiredHouseNumber: 'Vyplňte číslo Vašeho baráku',
  requiredCity: 'Vyplňte název města',
  requiredPostalCode: 'Vyplňte PSČ',
};

export const checkoutCartSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
  })
  .extend({
    telephoneNumber: zodTelephoneNumber.refine(
      (value) => value.length >= 1,
      'Zadejte telefonní číslo'
    ),
    address: z.object({
      municipality: municipalitySchema.pick({ id: true }),
      houseNumber: z
        .string({ required_error: MESSAGES.requiredHouseNumber })
        .min(1, MESSAGES.requiredHouseNumber),
      streetName: addressStreetNameSchema,
      city: z
        .string({ required_error: MESSAGES.requiredCity })
        .min(1, MESSAGES.requiredCity),
      postalCode: z
        .string({ required_error: MESSAGES.requiredPostalCode })
        .min(1, MESSAGES.requiredPostalCode),
    }),
    saveAddressToAccount: z.boolean().default(false),
    paymentMethod: orderPaymentMethodSchema.pick({
      id: true,
    }),
    deliveryMethod: orderDeliveryMethodSchema.pick({
      id: true,
    }),
  });
