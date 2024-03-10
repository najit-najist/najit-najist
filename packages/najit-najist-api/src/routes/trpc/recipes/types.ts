import { database } from '@najit-najist/database';
import { recipeCategories } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { slugifyString } from '@utils';
import { DrizzleError } from 'drizzle-orm';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { EntityNotFoundError } from '../../../errors/EntityNotFoundError';
import { defaultGetManySchema } from '../../../schemas/base.get-many.schema';
import { recipeCategoryCreateInputSchema } from '../../../schemas/recipeCategoryCreateInputSchema';
import { t } from '../../../trpc';
import { ErrorCodes } from '../../../types';

export const typesRouter = t.router({
  getOne: protectedProcedure
    .input(entityLinkSchema)
    .query(async ({ input, ctx }) => {
      try {
        const item = await database.query.recipeCategories.findFirst({
          where: (schema, { eq }) => eq(schema.id, input.id),
        });

        if (!item) {
          throw new EntityNotFoundError({
            entityName: recipeCategories._.name,
          });
        }

        return item;
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Náročnost receptu pod daným polem 'id' nebyl nalezen`,
            origin: 'RecipeTypeService',
          });
        }

        throw error;
      }
    }),

  getMany: protectedProcedure
    .input(
      defaultGetManySchema
        .omit({ perPage: true })
        .extend({
          perPage: z.number().min(1).default(99).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const { page = 1, perPage = 40 } = input ?? {};

      // TODO: pagination

      return await database.query.recipeCategories.findMany();
    }),

  create: onlyAdminProcedure
    .input(recipeCategoryCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await database
          .insert(recipeCategories)
          .values({
            title: input.title,
            slug: slugifyString(input.title),
          })
          .returning();
      } catch (error) {
        if (error instanceof DrizzleError) {
          if (
            error.message.includes('title') ||
            error.message.includes('slug')
          ) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název typu musí být unikátní`,
              origin: 'RecipeTypeService',
            });
          }
        }

        throw error;
      }
    }),
});
