import { database } from '@najit-najist/database';
import { and, eq } from '@najit-najist/database/drizzle';
import { userCartProducts } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@server/trpc/instance';
import { publicProcedure } from '@server/trpc/procedures/publicProcedure';
import { getUserCart } from '@utils/getUserCart';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { userCartUpdateInputSchema } from '../../../../schemas/userCartUpdateInputSchema';

export const userCartRoutes = t.router({
  products: t.router({
    update: publicProcedure
      .input(userCartUpdateInputSchema)
      .mutation(async ({ input, ctx }) => {
        const searchValue = ctx.sessionData.user?.id ?? ctx.sessionData.cartId;
        const cart = await getUserCart({
          type: ctx.sessionData.user?.id ? 'user' : 'cart',
          value: Number(searchValue ?? 0),
        });

        if (cart) {
          const existingProductInCart = cart.products.find(
            ({ product }) => product.id === input.product.id,
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
                  eq(userCartProducts.productId, input.product.id),
                ),
              );
          } else {
            await database.insert(userCartProducts).values({
              productId: input.product.id,
              cartId: cart.id,
              count: input.count,
            });
          }
        }

        revalidatePath('/muj-ucet/kosik');

        return {
          count: input.count,
        };
      }),

    remove: publicProcedure
      .input(z.object({ product: entityLinkSchema }))
      .mutation(async ({ input, ctx }) => {
        const searchValue = ctx.sessionData.user?.id ?? ctx.sessionData.cartId;
        const cart = await getUserCart({
          type: ctx.sessionData.user?.id ? 'user' : 'cart',
          value: Number(searchValue ?? 0),
        });

        if (cart) {
          await database
            .delete(userCartProducts)
            .where(
              and(
                eq(userCartProducts.cartId, cart.id),
                eq(userCartProducts.productId, input.product.id),
              ),
            );
        }

        revalidatePath('/muj-ucet/kosik');
      }),
  }),
});
