import { ErrorCodes } from '@custom-types';
import { ApplicationError, EntityNotFoundError } from '@errors';
import { logger } from '@logger';
import { database } from '@najit-najist/database';
import {
  Product,
  productCategories,
  productPrices,
  productStock,
  products,
  users,
} from '@najit-najist/database/models';
import { nonEmptyStringSchema, slugSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { publicProcedure } from '@trpc-procedures/publicProcedure';
import { slugifyString } from '@utils';
import { DrizzleError, SQL, eq, ilike, inArray, or } from 'drizzle-orm';
import fs from 'fs-extra';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { LibraryService } from '../../LibraryService';
import { libraryManager } from '../../libraryManager';
import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { productCategoryCreateInputSchema } from '../../schemas/productCategoryCreateInputSchema';
import { productCreateInputSchema } from '../../schemas/productCreateInputSchema';
import { productUpdateInputSchema } from '../../schemas/productUpdateInputSchema';

const baseWith = {
  images: true,
  category: true,
  onlyForDeliveryMethod: true,
  price: true,
  stock: true,
} as const;

export const getOneProductBy = async <V extends keyof Product>(
  by: V,
  value: Product[V]
) => {
  const item = await database.query.products.findFirst({
    where: (schema, { eq }) => eq(schema[by], value as any),
    with: baseWith,
  });

  if (!item) {
    throw new EntityNotFoundError({
      entityName: products._.name,
    });
  }

  return item;
};

const getRoutes = t.router({
  one: publicProcedure
    .input(entityLinkSchema.or(z.object({ slug: nonEmptyStringSchema })))
    .query(async ({ input, ctx }) => {
      const by = 'id' in input ? 'id' : 'slug';

      try {
        return getOneProductBy(by, (input as any)[by]);
      } catch (error) {
        logger.error({ error, input }, 'Failed to get product');

        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Produkt pod daným polem '${Object.keys(
              input
            )}' nebyl nalezen`,
            origin: 'products',
          });
        }

        throw error;
      }
    }),
  many: publicProcedure
    .input(
      defaultGetManySchema.extend({
        categorySlug: z.array(slugSchema).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page = 1, perPage = 40, search, categorySlug } = input ?? {};
      // TODO: pagination

      try {
        const conditions: SQL[] = [];

        if (categorySlug?.length) {
          conditions.push(inArray(productCategories.slug, categorySlug));
        }

        if (search) {
          conditions.push(
            or(
              ilike(products.name, `%${search}%`),
              ilike(products.description, `%${search}%`)
            )!
          );
        }

        const result = database.query.products.findMany({
          where: (schema, { and }) =>
            conditions.length ? and(...conditions) : undefined,
          with: {
            category: true,
            images: true,
            onlyForDeliveryMethod: true,
            price: true,
            stock: true,
          },
        });

        return result;
      } catch (error) {
        logger.error(error, 'Failed to get many products');

        throw error;
      }
    }),
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
      // TODO: pagination

      return database.query.productCategories.findMany();
    }),
});

const categoriesRoutes = t.router({
  get: getCategoriesRoutes,

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
        logger.error(error, 'Failed to create product category');
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

        logger.error(error, 'Could not create product category');

        throw error;
      }
    }),
});

export const productsRoutes = t.router({
  get: getRoutes,
  create: onlyAdminProcedure
    .input(productCreateInputSchema)
    .mutation(async ({ input }) => {
      let filesToDelete: string[] = [];
      try {
        await database.transaction(async (tx) => {
          const [createdProduct] = await tx
            .insert(products)
            .values({
              ...input,
              slug: slugifyString(input.name),
              categoryId: input.category?.id,
            })
            .returning();

          await tx
            .insert(productPrices)
            .values({ ...input.price, productId: createdProduct.id })
            .returning();

          if (input.stock) {
            await tx
              .insert(productStock)
              .values({
                productId: createdProduct.id,
                value: input.stock.count,
              })
              .returning();
          }

          const createdImagePaths: string[] = [];
          const imagesThatAreBeingCreated: Promise<any>[] = [];
          for (const imageBase64 of input.images) {
            imagesThatAreBeingCreated.push(
              libraryManager
                .saveFile(users, createdProduct.id, imageBase64)
                .then(({ filename, absoluteFilename }) => {
                  createdImagePaths.push(filename);
                  filesToDelete.push(absoluteFilename);
                })
            );
          }
          await Promise.all(imagesThatAreBeingCreated);
        });

        revalidatePath(`/produkty`);
      } catch (error) {
        logger.error(
          {
            error,
          },
          'Failed to create product'
        );

        await Promise.all(
          filesToDelete.map(async (absoluteFilepath) =>
            fs.remove(absoluteFilepath)
          )
        );

        throw error;
      }
    }),

  delete: onlyAdminProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      const existing = await getOneProductBy('id', input.id);

      await database.delete(products).where(eq(products.id, input.id));

      revalidatePath(`/produkty/${existing.slug}`);
      revalidatePath(`/produkty`);

      return;
    }),

  update: onlyAdminProcedure
    .input(entityLinkSchema.extend({ payload: productUpdateInputSchema }))
    .mutation(async ({ input, ctx }) => {
      const library = new LibraryService(users);

      try {
        const existing = await getOneProductBy('id', input.id);

        const updated = await database.transaction(async (tx) => {
          if (input.payload.price) {
            await tx
              .update(productPrices)
              .set(input.payload.price)
              .where(eq(productPrices.productId, existing.id));
          }

          const stockUpdatePayload = input.payload.stock;

          if (stockUpdatePayload || stockUpdatePayload === null) {
            if (stockUpdatePayload) {
              if (!existing.stock) {
                await tx.insert(productStock).values({
                  value: stockUpdatePayload.count ?? 1,
                  productId: existing.id,
                });
              } else {
                await tx
                  .update(productPrices)
                  .set({
                    value: stockUpdatePayload.count,
                  })
                  .where(eq(productPrices.productId, existing.id));
              }
            } else if (stockUpdatePayload === null && existing.stock) {
              await tx
                .delete(productStock)
                .where(eq(productStock.productId, existing.id));
            }
          }

          // TODO: Handle images

          // TODO: remove products from carts when product is removed, disabled or has no stock

          const [updated] = await database
            .update(products)
            .set({
              ...input.payload,
              ...(input.payload.name ? { slug: input.payload.name } : {}),
            })
            .where(eq(products.id, existing.id))
            .returning();

          await library.commit();

          return updated;
        });

        revalidatePath(`/produkty/${updated.slug}`);
        revalidatePath(`/produkty`);
      } catch (error) {
        logger.error(error, 'Failed to update product');

        library.endTransaction();

        if (EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Recept pod daným id '${input.id}' nebyl nalezen`,
            origin: 'products',
          });
        }

        throw error;
      }
    }),

  categories: categoriesRoutes,
});
