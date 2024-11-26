import { ErrorCodes } from '@custom-types/ErrorCodes';
import { database } from '@najit-najist/database';
import {
  DrizzleError,
  getTableName,
  sql,
} from '@najit-najist/database/drizzle';
import { recipeCategories } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { onlyAdminProcedure } from '@server/trpc/procedures/onlyAdminProcedure';
import { protectedProcedure } from '@server/trpc/procedures/protectedProcedure';
import { slugifyString } from '@server/utils/slugifyString';
import generateCursor from 'drizzle-cursor';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { EntityNotFoundError } from '../../../errors/EntityNotFoundError';
import { defaultGetManySchema } from '../../../schemas/base.get-many.schema';
import { recipeCategoryCreateInputSchema } from '../../../schemas/recipeCategoryCreateInputSchema';
import { t } from '../../../trpc';

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
            entityName: getTableName(recipeCategories),
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
        .default({}),
    )
    .query(async ({ input, ctx }) => {
      const cursor = generateCursor({
        primaryCursor: {
          order: 'ASC',
          key: recipeCategories.id.name,
          schema: recipeCategories.id,
        },
        cursors: [
          {
            order: 'DESC',
            key: recipeCategories.createdAt.name,
            schema: recipeCategories.createdAt,
          },
        ],
      });

      const [items, [{ count }]] = await Promise.all([
        database.query.recipeCategories.findMany({
          limit: input.perPage,
          where: cursor.where(input.page),
          orderBy: cursor.orderBy,
        }),
        database
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(recipeCategories),
      ]);

      return {
        items,
        nextToken:
          input.perPage === items.length
            ? cursor.serialize(items.at(-1))
            : null,
        total: count,
      };
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
