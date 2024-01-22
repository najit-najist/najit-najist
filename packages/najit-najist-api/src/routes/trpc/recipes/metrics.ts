import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';

import { ApplicationError } from '../../../errors/ApplicationError';
import {
  RecipeResourceMetric,
  createRecipeResourceMetricInputSchema,
  getManyRecipeResourceMetricInputSchema,
} from '../../../schemas/recipes';
import { createRequestPocketbaseRequestOptions } from '../../../server';
import { t } from '../../../trpc';
import {
  ErrorCodes,
  PocketbaseCollections,
  PocketbaseErrorCodes,
} from '../../../types';

export const metricsRouter = t.router({
  getMany: protectedProcedure
    .input(getManyRecipeResourceMetricInputSchema.optional())
    .query(async ({ input, ctx }) => {
      const { page = 1, perPage = 40 } = input ?? {};

      try {
        const result = await pocketbase
          .collection(PocketbaseCollections.RECIPE_RESOURCE_METRIC)
          .getList<RecipeResourceMetric>(
            page,
            perPage,
            createRequestPocketbaseRequestOptions(ctx)
          );

        return result;
      } catch (error) {
        throw error;
      }
    }),

  create: onlyAdminProcedure
    .input(createRecipeResourceMetricInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await pocketbase
          .collection(PocketbaseCollections.RECIPE_RESOURCE_METRIC)
          .create(
            { name: input.name },
            createRequestPocketbaseRequestOptions(ctx)
          );
      } catch (error) {
        if (error instanceof ClientResponseError) {
          const data = error.data.data;

          if (data.name?.code === PocketbaseErrorCodes.NOT_UNIQUE) {
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
