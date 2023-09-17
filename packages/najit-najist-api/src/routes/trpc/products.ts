import {
  createProductSchema,
  getManyProductsSchema,
  getOneProductSchema,
  updateProductSchema,
} from '@schemas';
import { ProductService } from '@services/Product.service';
import { t } from '@trpc';
import { onlyAdminProcedure } from '@trpc-procedures/protectedProcedure';
import { z } from 'zod';

const getRoutes = t.router({
  one: t.procedure
    .input(getOneProductSchema)
    .query(async ({ input }) => ProductService.getBy('id', input.id)),
  many: t.procedure
    .input(getManyProductsSchema)
    .query(async ({ input }) => ProductService.getMany(input)),
});

export const productsRoutes = t.router({
  get: getRoutes,
  create: onlyAdminProcedure
    .input(createProductSchema)
    .mutation(({ input, ctx }) =>
      ProductService.create({ ...input, createdBy: ctx.sessionData.userId })
    ),
  update: onlyAdminProcedure
    .input(z.object({ id: z.string(), payload: updateProductSchema }))
    .mutation(({ input }) => ProductService.update(input.id, input.payload)),
});
