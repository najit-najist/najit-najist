'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { orderDeliveryMethods } from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { canUser, UserActions } from '@server/utils/canUser';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { updateShipmentMethodSchema } from '../schemas/updateShipmentMethodSchema';

export const updateShipmentMethodAction = createActionWithValidation(
  z.object({ id: z.number(), values: updateShipmentMethodSchema }),
  async ({ id, values }) => {
    const user = await getLoggedInUser();

    if (!canUser(user, UserActions.UPDATE, orderDeliveryMethods)) {
      throw new InsufficientRoleError();
    }

    const existing = await database.query.orderDeliveryMethods.findFirst({
      where: (schema, { eq }) => eq(schema.id, id),
    });

    if (!existing) {
      return notFound();
    }

    const [updated] = await database
      .update(orderDeliveryMethods)
      .set({
        notes: values.notes,
        description: values.description ?? '',
        price: values.price,
      })
      .where(eq(orderDeliveryMethods.id, id))
      .returning();

    logger.info('[SHIPPING] Updated', {
      id,
      values,
    });

    revalidatePath(`/administrace/doprava`);
    revalidatePath(`/administrace/doprava/${updated.id}`);
  },
);
