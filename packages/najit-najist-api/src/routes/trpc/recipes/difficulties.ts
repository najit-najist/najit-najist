import { database } from '@najit-najist/database';
import { recipeDifficulties } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { onlyAdminProcedure } from '@trpc-procedures/onlyAdminProcedure';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { slugifyString } from '@utils';
import { DrizzleError } from 'drizzle-orm';
import { z } from 'zod';

import { ApplicationError } from '../../../errors/ApplicationError';
import { EntityNotFoundError } from '../../../errors/EntityNotFoundError';
import { defaultGetManySchema } from '../../../schemas/base.get-many.schema';
import { recipeDifficultyCreateInputSchema } from '../../../schemas/recipeDifficultyCreateInputSchema';
import { logger } from '../../../server';
import { t } from '../../../trpc';
import { ErrorCodes } from '../../../types';

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
            entityName: recipeDifficulties._.name,
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
          perPage: z.number().min(1).default(99).optional(),
        })
        .optional()
    )
    .query(({ input, ctx }) => {
      // TODO: pagination
      const { page = 1, perPage = 40 } = input ?? {};

      return database.query.recipeDifficulties.findMany();
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
