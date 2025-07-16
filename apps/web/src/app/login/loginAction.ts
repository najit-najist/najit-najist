'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq, inArray, sql } from '@najit-najist/database/drizzle';
import {
  UserCartProduct,
  userCartProducts,
  userCarts,
  UserStates,
} from '@najit-najist/database/models';
import { EntityLink } from '@najit-najist/schemas';
import { userProfileLogInInputSchema } from '@server/schemas/userProfileLogInInputSchema';
import { PasswordService } from '@server/services/Password.service';
import { UserService } from '@server/services/UserService';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { setSessionToCookies } from '@server/utils/setSessionToCookies';
import { zodErrorToFormErrors } from '@utils/zodErrorToFormErrors';
import { cookies } from 'next/headers';
import { z } from 'zod';

const inputValidation = userProfileLogInInputSchema.superRefine(
  async (input, ctx) => {
    const userForInput = await database.query.users.findFirst({
      where: (s, { eq }) => eq(sql`lower(${s.email})`, input.email),
    });
    const validPassword = userForInput
      ? await PasswordService.validate(userForInput._password, input.password)
      : false;

    if (userForInput?.status === UserStates.SUBSCRIBED) {
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message:
          'Děkujeme za Váš zájem na našem prvním webu! Při spuštění nového webu jsme Vám zaslali pozvánku na které byl odkaz pro dokončení registrace. Pokud email již nenaleznete tak otevřete odkaz "Zapomenuté heslo?" na této stránce a pokračujte dále podle instrukcí',
        path: ['root'],
      });

      logger.warn(
        '[LOGIN] Subscribed user tried to login, but we showed message',
        { email: input.email },
      );

      return;
    }

    if (!userForInput || !validPassword) {
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message: 'Nesprávné přihlašovací údaje',
        path: ['email'],
      });
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message: 'Nesprávné přihlašovací údaje',
        path: ['password'],
      });
      logger.warn(
        userForInput
          ? '[LOGIN] User gave invalid credentials'
          : '[LOGIN] User tried to log in under non existing email',
        { email: input.email },
      );
    } else {
      if (userForInput.status === UserStates.INVITED) {
        logger.warn('[LOGIN] Unverified user tried to log in', {
          email: input.email,
        });

        ctx.addIssue({
          code: 'custom',
          fatal: true,
          message: 'Váš učet ještě není aktivován, dokončete registraci',
          path: ['root'],
        });
      } else if (userForInput.status === UserStates.BANNED) {
        logger.warn('[LOGIN] Banned user tried to log in', {
          email: input.email,
          status: userForInput.status,
        });

        ctx.addIssue({
          code: 'custom',
          fatal: true,
          message:
            'Váš účet byl zablokován. Pokud si myslíte, že se jedná o chybu tak nás neváhejte kontaktovat',
          path: ['root'],
        });
      } else if (userForInput.status === UserStates.DEACTIVATED) {
        logger.warn('[LOGIN] User deactivated tried to log in', {
          email: input.email,
          status: userForInput.status,
        });

        ctx.addIssue({
          code: 'custom',
          fatal: true,
          message: 'Účet pod uvedeným emailem již nevedeme.',
          path: ['root'],
        });
      }
    }
  },
);

export type LoginActionOptions = z.input<typeof inputValidation>;
const simpleCartWith = {
  products: true,
  coupon: true,
} as const;

const mergeCartsUponLogin = async (
  loggedUserId: EntityLink['id'],
  anonymousCartId: EntityLink['id'],
) => {
  const anonymousCart = await database.query.userCarts.findFirst({
    where: (schema, { eq }) => eq(schema.id, anonymousCartId),
    with: simpleCartWith,
  });

  // Return early, this means that cart died sooner that user session
  if (!anonymousCart) {
    return;
  }

  const userCart = await database.query.userCarts.findFirst({
    where: (schema, { eq }) => eq(schema.userId, loggedUserId),
    with: simpleCartWith,
  });

  // If user has no cart yet then the work is easier
  if (!userCart) {
    await database
      .update(userCarts)
      .set({ userId: loggedUserId })
      .where(eq(userCarts.id, anonymousCart.id));

    return;
  }

  await database.transaction(async (ctx) => {
    // delete existing and merge the state between each entry in cart - there can be same products. Do not forget about the coupons!
    await ctx
      .delete(userCarts)
      .where(inArray(userCarts.id, [anonymousCart.id, userCart.id]));

    const [newCart] = await ctx
      .insert(userCarts)
      .values({
        couponId: userCart.couponId,
        userId: userCart.userId,
      })
      .returning();

    const resultedProductsAsMap = new Map<
      UserCartProduct['id'],
      Omit<UserCartProduct, 'id' | 'createdAt' | 'updatedAt'>
    >();
    const mergedProductItems = [
      ...anonymousCart.products,
      ...userCart.products,
    ];

    for (const cartItem of mergedProductItems) {
      const existring = resultedProductsAsMap.get(cartItem.productId);
      if (!existring) {
        resultedProductsAsMap.set(cartItem.productId, {
          cartId: newCart.id,
          count: cartItem.count,
          productId: cartItem.productId,
        });
        continue;
      }

      existring.count += cartItem.count;
    }

    await ctx
      .insert(userCartProducts)
      .values([...resultedProductsAsMap.values()]);
  });
};

export async function loginAction(options: LoginActionOptions) {
  const validatedInput = await inputValidation.safeParseAsync(options);

  if (!validatedInput.success) {
    logger.warn('[LOGIN] Invalid input', {
      input: {
        email: options.email,
      },
      errors: validatedInput.error.format(),
    });

    return {
      errors: zodErrorToFormErrors(validatedInput.error.errors, true),
    };
  }

  try {
    const session = await getSessionFromCookies({ cookies: await cookies() });
    const user = await UserService.forUser({
      email: validatedInput.data.email,
    });

    logger.info('[LOGIN] Success', { email: validatedInput.data.email });

    // No need to wait
    user
      .update({
        lastLoggedIn: new Date(),
      })
      .catch((error) =>
        logger.error('[LOGIN] Cannot update user lastLoggedIn', {
          email: validatedInput.data.email,
          error,
        }),
      );

    const userId = user.getFor().id;
    const { cartId } = session;
    if (cartId) {
      try {
        await mergeCartsUponLogin(userId, cartId);
      } catch (error) {
        logger.error(
          '[LOGIN] Failed to merge anonymous cart with the logged in user cart',
          { error, user: { id: userId }, anonymousCartId: cartId },
        );
      }
    }

    await setSessionToCookies(
      {
        // TODO: This should be removed after release
        previewAuthorized: true,
        authContent: {
          userId: user.getFor().id,
        },
      },
      await cookies(),
    );

    return {
      errors: null,
    };
  } catch (error) {
    logger.error('[LOGIN] Fatal fail during login', { error, validatedInput });

    throw error;
  }
}
