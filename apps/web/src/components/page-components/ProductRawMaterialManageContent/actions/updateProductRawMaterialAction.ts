'use server';

import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { productRawMaterials, UserRoles } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { InsufficientRoleError } from '@server/errors';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getProductRawMaterial } from '@server/utils/getProductRawMaterial';
import { getLoggedInUser } from '@server/utils/server';
import { slugifyString } from '@server/utils/slugifyString';

import { createProductRawMaterialSchema } from '../schemas/createProductRawMaterialSchema';

export const updateProductRawMaterialAction = createActionWithValidation(
  entityLinkSchema
    .extend({ data: createProductRawMaterialSchema })
    .superRefine(async ({ data: { name } }, ctx) => {
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
      .update(productRawMaterials)
      .set({
        name: input.data.name,
        slug: slugifyString(input.data.name),
      })
      .where(eq(productRawMaterials.id, input.id))
      .returning();

    return { success: true, data };
  },
);
