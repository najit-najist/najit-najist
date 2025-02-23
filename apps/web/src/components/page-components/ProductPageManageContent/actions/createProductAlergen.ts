'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { productAlergens, UserRoles } from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getProductAlergen } from '@server/utils/getProductAlergen';
import { getLoggedInUser } from '@server/utils/server';
import { slugifyString } from '@server/utils/slugifyString';
import { z } from 'zod';

export const createProductAlergen = createActionWithValidation(
  z.object({
    name: z.string().refine(async (value) => {
      const existing = await getProductAlergen({ name: value });

      return !existing;
    }, 'Tento alergen již existuje'),
    description: z.string().nullish(),
  }),
  async (input) => {
    const user = await getLoggedInUser();

    if (user.role !== UserRoles.ADMIN) {
      throw new InsufficientRoleError();
    }

    const [data] = await database
      .insert(productAlergens)
      .values({
        name: input.name,
        slug: slugifyString(input.name),
        description: input.description,
      })
      .returning();

    logger.info('[PRODUCT_ALERGEN] Created', { input });

    return { success: true, data };
  },
);
