'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { userCartProducts } from '@najit-najist/database/models';
import { userCartAddItemInputSchema } from '@server/schemas/userCartAddItemInputSchema';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { getLoggedInUser } from '@server/utils/server';
import { setSessionToCookies } from '@server/utils/setSessionToCookies';
import { createUserCart } from '@utils/createUserCart';
import { getUserCart } from '@utils/getUserCart';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const addProductToCartAction = createActionWithValidation(
  userCartAddItemInputSchema,
  async ({ count, product }) => {
    const productStock = await database.query.productStock.findFirst({
      where: (schema, { eq }) => eq(schema.productId, product.id),
    });

    if (productStock?.value === 0) {
      return {
        errorMessage: 'Produkt již není na skladě 😢',
      };
    }

    const sessionData = await getSessionFromCookies();

    let currentCart = await getUserCart({
      type: sessionData.cartId ? 'cart' : 'user',
      value: Number(
        sessionData.authContent?.userId ?? sessionData.cartId ?? '0',
      ),
    });

    if (!currentCart) {
      const loggedInUser = await getLoggedInUser().catch(() => undefined);
      const isAnonymous = !loggedInUser;

      currentCart = await createUserCart(
        isAnonymous ? {} : { userId: loggedInUser.id },
      );

      if (isAnonymous) {
        await setSessionToCookies(
          { ...sessionData, cartId: currentCart.id },
          await cookies(),
        );
      }
    }

    const existingProductInCart = currentCart.products.find(
      ({ product }) => product.id === product.id,
    );

    if (existingProductInCart) {
      await database
        .update(userCartProducts)
        .set({
          count: count + existingProductInCart.count,
        })
        .where(
          and(
            eq(userCartProducts.cartId, currentCart.id),
            eq(userCartProducts.productId, product.id),
          ),
        );
    } else {
      await database.insert(userCartProducts).values({
        productId: product.id,
        cartId: currentCart.id,
        count: count,
      });
    }

    revalidatePath('/muj-ucet/kosik');
  },
  {
    onHandlerError(error, input) {
      logger.error('[CART] Failed to add product', {
        error,
        input,
      });
    },
    async onValidationError() {
      logger.error('[CART] Vaildation failed when adding to cart');
    },
  },
);
