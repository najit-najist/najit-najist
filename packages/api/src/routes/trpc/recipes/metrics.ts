import { database } from '@najit-najist/database';
import { recipeResourceMetrics } from '@najit-najist/database/models';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import generateCursor from 'drizzle-cursor';
import { DrizzleError, sql } from 'drizzle-orm';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { defaultGetManySchema } from '../../../schemas/base.get-many.schema';
import { recipeResourceMetricCreateInputSchema } from '../../../schemas/recipeResourceMetricCreateInputSchema';
import { logger } from '../../../server';
import { t } from '../../../trpc';
import { ErrorCodes } from '../../../types';

export const metricsRouter = t.router({
  getMany: protectedProcedure
    .input(defaultGetManySchema.omit({ search: true }))
    .query(async ({ input, ctx }) => {
      const cursor = generateCursor({
        primaryCursor: {
          order: 'ASC',
          key: recipeResourceMetrics.id.name,
          schema: recipeResourceMetrics.id,
        },
        cursors: [
          {
            order: 'DESC',
            key: recipeResourceMetrics.createdAt.name,
            schema: recipeResourceMetrics.createdAt,
          },
        ],
      });

      const [items, [{ count }]] = await Promise.all([
        database.query.recipeResourceMetrics.findMany({
          limit: input.perPage,
          where: cursor.where(input.page),
          orderBy: cursor.orderBy,
        }),
        database
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(recipeResourceMetrics),
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
    .input(recipeResourceMetricCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await database
          .insert(recipeResourceMetrics)
          .values({ name: input.name })
          .returning();
      } catch (error) {
        if (error instanceof DrizzleError) {
          logger.error(error, 'Failed to create recipe resource metric');

          if (error.message.includes('name')) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název metriky musí být unikátní`,
              origin: 'RecipeResourceMetricService',
            });
          }
        }

        throw error;
      }
    }),
});