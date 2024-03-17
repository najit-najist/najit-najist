import { ErrorCodes } from '@custom-types';
import { ApplicationError, EntityNotFoundError } from '@errors';
import { logger } from '@logger';
import { database } from '@najit-najist/database';
import {
  Product,
  productCategories,
  productImages,
  productPrices,
  productStock,
  products,
  userCartProducts,
} from '@najit-najist/database/models';
import {
  isFileBase64,
  nonEmptyStringSchema,
  slugSchema,
} from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { publicProcedure } from '@trpc-procedures/publicProcedure';
import { slugifyString } from '@utils';
import generateCursor from 'drizzle-cursor';
import {
  DrizzleError,
  SQL,
  and,
  eq,
  getTableName,
  ilike,
  inArray,
  or,
  sql,
} from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { promise, z } from 'zod';

import { LibraryService } from '../../LibraryService';
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
      entityName: getTableName(products),
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
      const { search, categorySlug } = input ?? {};

      const conditions: SQL[] = [];

      if (categorySlug?.length) {
        const categories = await database.query.productCategories.findMany({
          where: inArray(productCategories.slug, categorySlug),
        });

        conditions.push(
          inArray(
            products.categoryId,
            categories.map(({ id }) => id)
          )
        );
      }

      if (search) {
        conditions.push(
          or(
            ilike(products.name, `%${search}%`),
            ilike(products.description, `%${search}%`)
          )!
        );
      }

      const cursor = generateCursor({
        primaryCursor: {
          order: 'ASC',
          key: products.id.name,
          schema: products.id,
        },
        cursors: [
          {
            order: 'DESC',
            key: products.createdAt.name,
            schema: products.createdAt,
          },
          {
            order: 'ASC',
            key: products.publishedAt.name,
            schema: products.publishedAt,
          },
        ],
      });

      try {
        const [items, [{ count }]] = await Promise.all([
          database.query.products.findMany({
            where: and(...conditions, cursor.where(input.page)),
            orderBy: cursor.orderBy,
            limit: input.perPage,
            with: {
              category: true,
              images: true,
              onlyForDeliveryMethod: true,
              price: true,
              stock: true,
            },
          }),
          database
            .select({
              count: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(products)
            .where(and(...conditions)),
        ]);

        return {
          items,
          nextToken:
            input.perPage === items.length
              ? cursor.serialize(items.at(-1))
              : null,
          total: count,
        };
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
    .query(async ({ input, ctx }) => {
      const cursor = generateCursor({
        primaryCursor: {
          order: 'ASC',
          key: productCategories.id.name,
          schema: productCategories.id,
        },
        cursors: [
          {
            order: 'ASC',
            key: productCategories.name.name,
            schema: productCategories.name,
          },
        ],
      });

      const [items, [{ count }]] = await Promise.all([
        database.query.productCategories.findMany({
          limit: input.perPage,
          where: cursor.where(input.page),
          orderBy: cursor.orderBy,
        }),
        database
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(productCategories),
      ]);

      return {
        items,
        nextToken:
          input.perPage === items.length
            ? cursor.serialize(items.at(-1))
            : null,
        total: count,
      };
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
      const library = new LibraryService(products);

      try {
        library.beginTransaction();

        const created = await database.transaction(async (tx) => {
          const {
            onlyForDeliveryMethod,
            price,
            images,
            category,
            stock,
            ...createPayload
          } = input;

          const [createdProduct] = await tx
            .insert(products)
            .values({
              ...createPayload,
              slug: slugifyString(input.name),
              categoryId: input.category?.id,
              ...(typeof onlyForDeliveryMethod !== 'undefined'
                ? { onlyForDeliveryMethodId: onlyForDeliveryMethod?.id ?? null }
                : {}),
            })
            .returning();

          await tx
            .insert(productPrices)
            .values({ ...price, productId: createdProduct.id })
            .returning();

          if (stock) {
            await tx
              .insert(productStock)
              .values({
                productId: createdProduct.id,
                value: stock.value,
              })
              .returning();
          }

          const imagesThatAreBeingCreated: Promise<any>[] = [];
          for (const imageBase64 of images) {
            imagesThatAreBeingCreated.push(
              library.create(createdProduct, imageBase64).then(({ filename }) =>
                tx.insert(productImages).values({
                  productId: createdProduct.id,
                  file: filename,
                })
              )
            );
          }
          await Promise.all(imagesThatAreBeingCreated);

          await library.commit();

          return createdProduct;
        });

        revalidatePath(`/produkty`);

        return created;
      } catch (error) {
        library.endTransaction();

        logger.error(
          {
            error,
          },
          'Failed to create product'
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
      const library = new LibraryService(products);

      try {
        const existing = await getOneProductBy('id', input.id);

        const updated = await database.transaction(async (tx) => {
          const {
            images,
            price,
            stock,
            category,
            onlyForDeliveryMethod,
            ...updatePayload
          } = input.payload;

          const [updated] = await tx
            .update(products)
            .set({
              ...updatePayload,
              ...(updatePayload.name
                ? { slug: slugifyString(updatePayload.name) }
                : {}),
              ...(category?.id ? { categoryId: category.id } : {}),
              ...(typeof onlyForDeliveryMethod !== 'undefined'
                ? { onlyForDeliveryMethodId: onlyForDeliveryMethod?.id ?? null }
                : {}),
            })
            .where(eq(products.id, existing.id))
            .returning();

          if (typeof stock?.value === 'number') {
            await tx
              .update(productStock)
              .set({
                value: stock.value,
              })
              .where(eq(productStock.productId, existing.id));
          }

          if (
            typeof price?.value === 'number' ||
            typeof price?.discount === 'number'
          ) {
            await tx
              .update(productPrices)
              .set({
                value: price.value,
                discount: price.discount,
              })
              .where(eq(productPrices.productId, existing.id));
          }

          if (typeof stock?.value === 'number' || stock === null) {
            if (stock) {
              if (!existing.stock) {
                await tx.insert(productStock).values({
                  value: stock.value ?? 1,
                  productId: existing.id,
                });
              } else {
                await tx
                  .update(productStock)
                  .set({
                    value: stock.value,
                  })
                  .where(eq(productStock.productId, existing.id));
              }
            } else if (stock === null && existing.stock) {
              await tx
                .delete(productStock)
                .where(eq(productStock.productId, existing.id));
            }
          }

          if (images) {
            const filesToDelete = existing.images.filter(
              ({ file }) => !images.includes(file)
            );

            const promisesToFulfill: Promise<any>[] = [];

            if (filesToDelete.length) {
              promisesToFulfill.push(
                tx.delete(productImages).where(
                  inArray(
                    productImages.id,
                    filesToDelete.map(({ id }) => id)
                  )
                ),
                ...filesToDelete.map(({ file }) =>
                  library.delete(existing, file)
                )
              );
            }

            promisesToFulfill.push(
              ...images
                .filter((newOrExistingImage) =>
                  isFileBase64(newOrExistingImage)
                )
                .map((newImage) =>
                  library
                    .create(existing, newImage)
                    .then(({ filename }) =>
                      tx
                        .insert(productImages)
                        .values({ file: filename, productId: existing.id })
                    )
                )
            );

            await Promise.all(promisesToFulfill);
          }

          // Remove disabled products from user carts if it should not be published
          if (updatePayload.publishedAt === null) {
            await tx
              .delete(userCartProducts)
              .where(eq(userCartProducts.productId, existing.id));
          }

          await library.commit();

          return updated;
        });

        revalidatePath('/muj-ucet/kosik/pokladna');
        revalidatePath(`/produkty/${updated.slug}`);
        revalidatePath(`/produkty`);

        return updated;
      } catch (error) {
        logger.error(error, 'Failed to update product');

        library.endTransaction();

        if (error instanceof EntityNotFoundError) {
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
