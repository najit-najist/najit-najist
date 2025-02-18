import { ErrorCodes } from '@custom-types';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { DrizzleError, and, ilike, sql } from '@najit-najist/database/drizzle';
import { productCategories } from '@najit-najist/database/models';
import { ApplicationError } from '@server/errors';
import { getProductCategoriesInputSchema } from '@server/schemas/getProductCategoriesInputSchema';
import { getProductsInputSchema } from '@server/schemas/getProductsInputSchema';
import { productAlergenCreateInputSchema } from '@server/schemas/productAlergenCreateInputSchema';
import { productRawMaterialCreateInputSchema } from '@server/schemas/productRawMaterialCreateInputSchema';
import { getproductAlergens } from '@server/utils/getProductAlergens';
import { getProductCategories } from '@server/utils/getProductCategories';
import { getProductRawMaterials } from '@server/utils/getProductRawMaterials';
import { getProducts } from '@server/utils/getProducts';
import { slugifyString } from '@server/utils/slugifyString';

import { productCategoryCreateInputSchema } from '../../schemas/productCategoryCreateInputSchema';
import { t } from '../instance';
import { onlyAdminProcedure } from '../procedures/onlyAdminProcedure';
import { publicProcedure } from '../procedures/publicProcedure';

const categoriesRoutes = t.router({
  get: t.router({
    many: t.procedure
      .input(getProductCategoriesInputSchema)
      .query(async ({ input }) => {
        return getProductCategories(input);
      }),
  }),

  create: onlyAdminProcedure
    .input(productCategoryCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      try {
        return database
          .insert(productCategories)
          .values({
            name,
            slug: slugifyString(name),
          })
          .returning();
      } catch (error) {
        logger.error('[PRODUCTS] Failed to create product category', { error });
        if (error instanceof DrizzleError) {
          if (
            error.message.includes('title') ||
            error.message.includes('slug')
          ) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název kategorie musí být unikátní`,
              origin: '/products/categories/create',
            });
          }
        }

        logger.error('[PRODUCTS] Could not create product category', { error });

        throw error;
      }
    }),
});

export const productsRoutes = t.router({
  get: t.router({
    many: publicProcedure
      .input(getProductsInputSchema)
      .query(async ({ input, ctx }) => {
        return await getProducts(input, { loggedInUser: ctx.sessionData.user });
      }),
  }),
  categories: categoriesRoutes,
  alergens: t.router({
    get: t.router({
      many: publicProcedure
        .input(productAlergenCreateInputSchema)
        .query(async ({ input }) => {
          return getproductAlergens(input);
        }),
    }),
  }),
  rawMaterials: t.router({
    get: t.router({
      many: publicProcedure
        .input(productRawMaterialCreateInputSchema)
        .query(async ({ input }) => {
          return getProductRawMaterials(input);
        }),
    }),
  }),
});
