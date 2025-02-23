'use server';

import { createActionWithValidation } from '@server/utils/createActionWithValidation';

import { createShipmentMethodSchema } from '../schemas/createShipmentMethodSchema';

export const createShipmentMethodAction = createActionWithValidation(
  createShipmentMethodSchema,
  async (input) => {
    throw new Error('Not supported yet');
  },
);
