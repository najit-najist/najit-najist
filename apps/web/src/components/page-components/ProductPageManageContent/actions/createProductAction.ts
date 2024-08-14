'use server';

import { database } from '@najit-najist/database';
import {
  productImages,
  productPrices,
  products,
  productStock,
  UserRoles,
} from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { logger } from '@server/logger';
import { productCreateInputSchema } from '@server/schemas/productCreateInputSchema';
import { LibraryService } from '@server/services/LibraryService';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server/getLoggedInUser';
import { slugifyString } from '@server/utils/slugifyString';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createProductAction = createActionWithValidation(
  productCreateInputSchema,
  async (input) => {
    const user = await getLoggedInUser();

    if (user.role !== UserRoles.ADMIN) {
      throw new InsufficientRoleError();
    }

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
              }),
            ),
          );
        }
        await Promise.all(imagesThatAreBeingCreated);

        await library.commit();

        return createdProduct;
      });

      revalidatePath(`/produkty`);
      revalidatePath(`/administrace`);

      redirect(`/administrace/produkty/${encodeURIComponent(created.slug)}`);

      return created;
    } catch (error) {
      library.endTransaction();

      logger.error(
        {
          error,
        },
        'Failed to create product',
      );

      throw error;
    }
  },
);
