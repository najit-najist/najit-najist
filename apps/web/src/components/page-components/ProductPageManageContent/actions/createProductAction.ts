'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import {
  productAlergensToProducts,
  productImages,
  productRawMaterialsToProducts,
  products,
  productStock,
  productsToDeliveryMethods,
  UserRoles,
} from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { productCreateInputSchema } from '@server/schemas/productCreateInputSchema';
import { LibraryService } from '@server/services/LibraryService';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { isNextNotFound } from '@server/utils/isNextNotFound';
import { isNextRedirect } from '@server/utils/isNextRedirect';
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
          images,
          category,
          stock,
          composedOf,
          alergens,
          toDeliveryMethods,
          ...createPayload
        } = input;

        const [createdProduct] = await tx
          .insert(products)
          .values({
            ...createPayload,
            slug: slugifyString(input.name),
            categoryId: input.category?.id,
          })
          .returning();

        if (composedOf.length) {
          await tx.insert(productRawMaterialsToProducts).values(
            composedOf.map(({ rawMaterial, notes, order, description }) => ({
              productId: createdProduct.id,
              rawMaterialId: rawMaterial.id,
              notes,
              order,
              description,
            })),
          );
        }

        if (toDeliveryMethods) {
          await tx.insert(productsToDeliveryMethods).values(
            Object.entries(toDeliveryMethods).map(([slug]) => ({
              deliveryMethodSlug: slug,
              productId: createdProduct.id,
            })),
          );
        }

        if (alergens.length) {
          await tx.insert(productAlergensToProducts).values(
            alergens.map(({ id }) => ({
              alergenId: id,
              productId: created.id,
            })),
          );
        }

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

      logger.info('[PRODUCT] Created', { input });

      redirect(`/administrace/produkty/${encodeURIComponent(created.slug)}`);

      return created;
    } catch (error) {
      if (!isNextRedirect(error) && !isNextNotFound(error)) {
        library.endTransaction();
      }

      throw error;
    }
  },
  {
    onHandlerError(error) {
      logger.error('[PRODUCTS] Failed to create product', {
        error,
      });
    },
  },
);
