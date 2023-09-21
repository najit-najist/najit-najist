import { PocketbaseCollections } from '@custom-types';
import { pocketbase } from '@najit-najist/pb';
import {
  createProductSchema,
  getManyProductsSchema,
  getOneProductSchema,
  productSchema,
  updateProductSchema,
} from '@schemas';
import { ProductService } from '@services/Product.service';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/protectedProcedure';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const getRoutes = t.router({
  one: t.procedure.input(getOneProductSchema).query(async ({ input }) => {
    const by = 'id' in input ? 'id' : 'slug';
    return ProductService.getBy(by, (input as any)[by]);
  }),
  many: t.procedure
    .input(getManyProductsSchema)
    .query(async ({ input }) => ProductService.getMany(input)),
});

export const productsRoutes = t.router({
  get: getRoutes,
  create: onlyAdminProcedure
    .input(createProductSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await ProductService.create({
        ...input,
        createdBy: ctx.sessionData.userId,
      });

      revalidatePath(`/produkty`);
      return result;
    }),

  delete: onlyAdminProcedure
    .input(productSchema.pick({ id: true, slug: true }))
    .mutation(async ({ input, ctx }) => {
      await pocketbase
        .collection(PocketbaseCollections.PRODUCTS)
        .delete(input.id);

      revalidatePath(`/produkty/${input.slug}`);
      revalidatePath(`/produkty`);

      return;
    }),

  update: onlyAdminProcedure
    .input(z.object({ id: z.string(), payload: updateProductSchema }))
    .mutation(async ({ input }) => {
      const result = await ProductService.update(input.id, input.payload);
      revalidatePath(`/produkty/${result.slug}`);
      revalidatePath(`/produkty`);

      return result;
    }),
});
