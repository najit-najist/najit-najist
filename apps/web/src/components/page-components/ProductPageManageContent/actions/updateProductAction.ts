'use server';

import { ErrorCodes } from '@custom-types/ErrorCodes';
import { database } from '@najit-najist/database';
import { eq, inArray } from '@najit-najist/database/drizzle';
import {
  productImages,
  productPrices,
  products,
  productStock,
  userCartProducts,
  UserRoles,
} from '@najit-najist/database/models';
import { entityLinkSchema, isFileBase64 } from '@najit-najist/schemas';
import {
  ApplicationError,
  EntityNotFoundError,
  InsufficientRoleError,
} from '@server/errors';
import { logger } from '@server/logger';
import { productUpdateInputSchema } from '@server/schemas/productUpdateInputSchema';
import { LibraryService } from '@server/services/LibraryService';
import { getOneProductBy } from '@server/trpc/routes/products';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server/getLoggedInUser';
import { slugifyString } from '@server/utils/slugifyString';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const updateProductAction = createActionWithValidation(
  entityLinkSchema.extend({ payload: productUpdateInputSchema }),

  async (input) => {
    const user = await getLoggedInUser();

    if (user.role !== UserRoles.ADMIN) {
      throw new InsufficientRoleError();
    }

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
            updatedAt: new Date(),
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
            ({ file }) => !images.includes(file),
          );

          const promisesToFulfill: Promise<any>[] = [];

          if (filesToDelete.length) {
            promisesToFulfill.push(
              tx.delete(productImages).where(
                inArray(
                  productImages.id,
                  filesToDelete.map(({ id }) => id),
                ),
              ),
              ...filesToDelete.map(({ file }) =>
                library.delete(existing, file),
              ),
            );
          }

          promisesToFulfill.push(
            ...images
              .filter((newOrExistingImage) => isFileBase64(newOrExistingImage))
              .map((newImage) =>
                library
                  .create(existing, newImage)
                  .then(({ filename }) =>
                    tx
                      .insert(productImages)
                      .values({ file: filename, productId: existing.id }),
                  ),
              ),
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

      const adminPath = `/administrace/produkty/${encodeURIComponent(updated.slug)}`;

      revalidatePath('/muj-ucet/kosik/pokladna');
      revalidatePath(`/produkty/${encodeURIComponent(updated.slug)}`);
      revalidatePath(adminPath);
      revalidatePath(`/produkty`);

      redirect(adminPath);

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
  },
);
