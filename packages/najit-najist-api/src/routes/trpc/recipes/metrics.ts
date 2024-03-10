import { database } from '@najit-najist/database';
import { recipeResourceMetrics } from '@najit-najist/database/models';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { DrizzleError } from 'drizzle-orm';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { recipeResourceMetricCreateInputSchema } from '../../../schemas/recipeResourceMetricCreateInputSchema';
import { logger } from '../../../server';
import { t } from '../../../trpc';
import { ErrorCodes } from '../../../types';

export const metricsRouter = t.router({
  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1).optional(),
          perPage: z.number().min(1).default(20).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const { page = 1, perPage = 40 } = input ?? {};
      // TODO: Pagination
      const result = database.query.recipeResourceMetrics.findMany();

      return result;
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
