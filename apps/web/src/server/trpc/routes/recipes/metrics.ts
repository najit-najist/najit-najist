import { ErrorCodes } from '@custom-types/ErrorCodes';
import { database } from '@najit-najist/database';
import { DrizzleError, sql } from '@najit-najist/database/drizzle';
import { recipeResourceMetrics } from '@najit-najist/database/models';
import { logger } from '@server/logger';
import { onlyAdminProcedure } from '@server/trpc/procedures/onlyAdminProcedure';
import { protectedProcedure } from '@server/trpc/procedures/protectedProcedure';
import generateCursor from 'drizzle-cursor';

import { ApplicationError } from '../../../errors/ApplicationError';
import { defaultGetManySchema } from '../../../schemas/base.get-many.schema';
import { recipeResourceMetricCreateInputSchema } from '../../../schemas/recipeResourceMetricCreateInputSchema';
import { t } from '../../../trpc';

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
    .mutation(async ({ input }) => {
      try {
        const result = await database
          .insert(recipeResourceMetrics)
          .values({ name: input.name })
          .returning();

        return result[0]!;
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
