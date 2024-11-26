'use server';

import { database } from '@najit-najist/database';
import { productRawMaterials, UserRoles } from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getProductRawMaterial } from '@server/utils/getProductRawMaterial';
import { getLoggedInUser } from '@server/utils/server';
import { slugifyString } from '@server/utils/slugifyString';

import { createProductRawMaterialSchema } from '../schemas/createProductRawMaterialSchema';

export const createProductRawMaterialAction = createActionWithValidation(
  createProductRawMaterialSchema.superRefine(async ({ name }, ctx) => {
    const existing = await getProductRawMaterial({ name });

    if (existing) {
      ctx.addIssue({
        path: ['name'],
        code: 'custom',
        fatal: true,
        message: 'Tato surovina již existuje',
      });
    }
  }),
  async (input) => {
    const user = await getLoggedInUser();

    if (user.role !== UserRoles.ADMIN) {
      throw new InsufficientRoleError();
    }

    const [data] = await database
      .insert(productRawMaterials)
      .values({
        name: input.name,
        slug: slugifyString(input.name),
      })
      .returning();

    return { success: true, data };
  },
);
