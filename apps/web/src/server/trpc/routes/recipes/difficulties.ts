import { ErrorCodes } from '@custom-types/ErrorCodes';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import {
  DrizzleError,
  getTableName,
  sql,
} from '@najit-najist/database/drizzle';
import { recipeDifficulties } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@server/trpc/instance';
import { onlyAdminProcedure } from '@server/trpc/procedures/onlyAdminProcedure';
import { protectedProcedure } from '@server/trpc/procedures/protectedProcedure';
import { slugifyString } from '@server/utils/slugifyString';
import generateCursor from 'drizzle-cursor';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { EntityNotFoundError } from '../../../errors/EntityNotFoundError';
import { defaultGetManySchema } from '../../../schemas/base.get-many.schema';
import { recipeDifficultyCreateInputSchema } from '../../../schemas/recipeDifficultyCreateInputSchema';

export const difficultiesRouter = t.router({
  getOne: protectedProcedure
    .input(entityLinkSchema)
    .query(async ({ input, ctx }) => {
      try {
        const item = await database.query.recipeDifficulties.findFirst({
          where: (schema, { eq }) => eq(schema.id, input.id),
        });

        if (!item) {
          throw new EntityNotFoundError({
            entityName: getTableName(recipeDifficulties),
          });
        }

        return item;
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Náročnost receptu pod daným polem 'id' nebyl nalezen`,
            origin: 'RecipeDifficultyService',
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
          perPage: z.number().min(1).default(40).optional(),
        })
        .default({}),
    )
    .query(async ({ input, ctx }) => {
      const cursor = generateCursor({
        primaryCursor: {
          order: 'ASC',
          key: recipeDifficulties.id.name,
          schema: recipeDifficulties.id,
        },
        cursors: [
          {
            order: 'DESC',
            key: recipeDifficulties.createdAt.name,
            schema: recipeDifficulties.createdAt,
          },
        ],
      });

      const [items, [{ count }]] = await Promise.all([
        database.query.recipeDifficulties.findMany({
          limit: input.perPage,
          where: cursor.where(input.page),
          orderBy: cursor.orderBy,
        }),
        database
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(recipeDifficulties),
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
    .input(recipeDifficultyCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { color, name } = input;

      try {
        return await database
          .insert(recipeDifficulties)
          .values({ name, color, slug: slugifyString(name) })
          .returning();
      } catch (error) {
        if (error instanceof DrizzleError) {
          logger.error(error, 'Failed to create recipe difficulty');

          if (
            error.message.includes('name') ||
            error.message.includes('slug')
          ) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název složitosti musí být unikátní`,
              origin: 'RecipeDifficultyService',
            });
          } else if (error.message.includes('color')) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Barva složitosti musí být unikátní`,
              origin: 'RecipeDifficultyService',
            });
          }
        }

        throw error;
      }
    }),
});
