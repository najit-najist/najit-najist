import {
  ErrorCodes,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '@custom-types';
import { ApplicationError } from '@errors';
import { logger } from '@logger';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { nonEmptyStringSchema, slugSchema } from '@najit-najist/schemas';
import { ProductService } from '@services/Product.service';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/protectedProcedure';
import { publicProcedure } from '@trpc-procedures/publicProcedure';
import { slugifyString } from '@utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { entityLinkSchema } from '../../schemas/entityLinkSchema';
import { productCategoryCreateInputSchema } from '../../schemas/productCategoryCreateInputSchema';
import { productCreateInputSchema } from '../../schemas/productCreateInputSchema';
import { productUpdateInputSchema } from '../../schemas/productUpdateInputSchema';
import { createRequestPocketbaseRequestOptions } from '../../server';

const getRoutes = t.router({
  one: publicProcedure
    .input(entityLinkSchema.or(z.object({ slug: nonEmptyStringSchema })))
    .query(async ({ input, ctx }) => {
      const by = 'id' in input ? 'id' : 'slug';
      return ProductService.getBy(
        by,
        (input as any)[by],
        createRequestPocketbaseRequestOptions(ctx)
      );
    }),
  many: publicProcedure
    .input(
      defaultGetManySchema.extend({
        categorySlug: z.array(slugSchema).optional(),
      })
    )
    .query(async ({ input, ctx }) =>
      ProductService.getMany(input, createRequestPocketbaseRequestOptions(ctx))
    ),
});

const getCategoriesRoutes = t.router({
  many: t.procedure
    .input(
      defaultGetManySchema
        .omit({ perPage: true })
        .extend({
          perPage: z.number().min(1).default(99).optional(),
        })
        .default({})
    )
    .query(({ input, ctx }) => {
      const { page, perPage } = input ?? {};

      try {
        return pocketbase
          .collection(PocketbaseCollections.PRODUCT_CATEGORIES)
          .getList<ProductCategory>(page, perPage);
      } catch (error) {
        throw error;
      }
    }),
});

const categoriesRoutes = t.router({
  get: getCategoriesRoutes,

  create: onlyAdminProcedure
    .input(productCategoryCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      try {
        return await pocketbase
          .collection(PocketbaseCollections.PRODUCT_CATEGORIES)
          .create(
            { name, slug: slugifyString(name) },
            createRequestPocketbaseRequestOptions(ctx)
          );
      } catch (error) {
        if (error instanceof ClientResponseError) {
          const data = error.data.data;

          if (
            data.title?.code === PocketbaseErrorCodes.NOT_UNIQUE ||
            data.slug?.code === PocketbaseErrorCodes.NOT_UNIQUE
          ) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název kategorie musí být unikátní`,
              origin: '/products/categories/create',
            });
          }
        }

        logger.error(error, 'Could not create product category');

        throw error;
      }
    }),
});

export const productsRoutes = t.router({
  get: getRoutes,
  create: onlyAdminProcedure
    .input(productCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await ProductService.create(
        {
          ...input,
          createdBy: ctx.sessionData.userId,
        },
        createRequestPocketbaseRequestOptions(ctx)
      );

      revalidatePath(`/produkty`);
      return result;
    }),

  delete: onlyAdminProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      await pocketbase
        .collection(PocketbaseCollections.PRODUCTS)
        .delete(input.id, createRequestPocketbaseRequestOptions(ctx));

      revalidatePath(`/produkty/${input.slug}`);
      revalidatePath(`/produkty`);

      return;
    }),

  update: onlyAdminProcedure
    .input(z.object({ id: z.string(), payload: productUpdateInputSchema }))
    .mutation(async ({ input, ctx }) => {
      const result = await ProductService.update(
        input.id,
        input.payload,
        createRequestPocketbaseRequestOptions(ctx)
      );
      revalidatePath(`/produkty/${result.slug}`);
      revalidatePath(`/produkty`);

      return result;
    }),

  categories: categoriesRoutes,
});
