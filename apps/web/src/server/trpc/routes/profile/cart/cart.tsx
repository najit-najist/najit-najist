import { database } from '@najit-najist/database';
import { and, asc, eq } from '@najit-najist/database/drizzle';
import {
  orderedProducts,
  userCartProducts,
  userCarts,
} from '@najit-najist/database/models';
import { EntityLink, entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@server/trpc/instance';
import { protectedProcedure } from '@server/trpc/procedures/protectedProcedure';
import { TRPCError } from '@trpc/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { userCartAddItemInputSchema } from '../../../../schemas/userCartAddItemInputSchema';
import { userCartUpdateInputSchema } from '../../../../schemas/userCartUpdateInputSchema';

export const getUserCart = async (link: EntityLink) => {
  let cart = await database.query.userCarts.findFirst({
    where: (schema, { eq }) => eq(schema.userId, link.id),
    with: {
      products: {
        orderBy: [asc(orderedProducts.createdAt)],
        with: {
          product: {
            with: {
              price: true,
              stock: true,
              images: true,
              category: true,
              onlyForDeliveryMethod: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    const [createdCart] = await database
      .insert(userCarts)
      .values({ userId: link.id })
      .returning();

    cart = {
      ...createdCart,
      products: [],
    };
  }

  let subtotal = 0;

  for (const productInCart of cart.products) {
    const { count, product } = productInCart;

    subtotal += count * (product.price?.value ?? 0);
  }

  // TODO: deselect items from cart if user is not eligible
  return { ...cart, subtotal };
};

export const userCartRoutes = t.router({
  products: t.router({
    get: t.router({
      many: protectedProcedure.query(async ({ ctx }) => {
        return getUserCart({ id: ctx.sessionData.userId }).then(
          (res) => res.products
        );
      }),
    }),

    add: protectedProcedure
      .input(userCartAddItemInputSchema)
      // TODO: improve, all those calls to db can be merged into one bigger query
      .mutation(async ({ input, ctx }) => {
        const productStock = await database.query.productStock.findFirst({
          where: (schema, { eq }) => eq(schema.productId, input.product.id),
        });

        if (productStock?.value === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Produkt není na skladě',
          });
        }

        const currentCart = await getUserCart({ id: ctx.sessionData.userId });
        const existingProductInCart = currentCart.products.find(
          ({ product }) => product.id === input.product.id
        );

        if (existingProductInCart) {
          await database
            .update(userCartProducts)
            .set({
              count: input.count + existingProductInCart.count,
            })
            .where(
              and(
                eq(userCartProducts.cartId, currentCart.id),
                eq(userCartProducts.productId, input.product.id)
              )
            );
        } else {
          await database.insert(userCartProducts).values({
            productId: input.product.id,
            cartId: currentCart.id,
            count: input.count,
          });
        }

        revalidatePath('/muj-ucet/kosik/pokladna');
      }),

    update: protectedProcedure
      .input(userCartUpdateInputSchema)
      .mutation(async ({ input, ctx }) => {
        const cart = await getUserCart({ id: ctx.sessionData.userId });
        const existingProductInCart = cart.products.find(
          ({ product }) => product.id === input.product.id
        );

        if (existingProductInCart) {
          await database
            .update(userCartProducts)
            .set({
              count: input.count,
            })
            .where(
              and(
                eq(userCartProducts.cartId, cart.id),
                eq(userCartProducts.productId, input.product.id)
              )
            );
        } else {
          await database.insert(userCartProducts).values({
            productId: input.product.id,
            cartId: cart.id,
            count: input.count,
          });
        }

        revalidatePath('/muj-ucet/kosik/pokladna');

        return {
          count: input.count,
        };
      }),

    remove: protectedProcedure
      .input(z.object({ product: entityLinkSchema }))
      .mutation(async ({ input, ctx }) => {
        const cart = await getUserCart({ id: ctx.sessionData.userId });

        await database
          .delete(userCartProducts)
          .where(
            and(
              eq(userCartProducts.cartId, cart.id),
              eq(userCartProducts.productId, input.product.id)
            )
          );

        revalidatePath('/muj-ucet/kosik/pokladna');
      }),
  }),
});
