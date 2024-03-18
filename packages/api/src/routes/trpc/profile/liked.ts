import { database } from '@najit-najist/database';
import { userLikedRecipes } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { and, eq } from 'drizzle-orm';

export const userLikedRecipesRoutes = t.router({
  getMany: protectedProcedure.query(async ({ ctx }) =>
    database.query.userLikedRecipes.findMany({
      where: (schema, { eq }) => eq(schema.userId, ctx.sessionData.userId),
    })
  ),

  has: protectedProcedure
    .input(entityLinkSchema)
    .query(async ({ input, ctx }) => {
      const liked = await database.query.userLikedRecipes.findFirst({
        where: (schema, { eq, and }) =>
          and(
            eq(schema.userId, ctx.sessionData.userId),
            eq(schema.recipeId, input.id)
          ),
      });

      return !!liked;
    }),

  add: protectedProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      await database
        .insert(userLikedRecipes)
        .values({ userId: ctx.sessionData.userId, recipeId: input.id });
    }),

  remove: protectedProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      const liked = await database.query.userLikedRecipes.findFirst({
        where: (schema, { eq, and }) =>
          and(
            eq(schema.userId, ctx.sessionData.userId),
            eq(schema.recipeId, input.id)
          ),
      });

      if (!liked) {
        return;
      }

      await database
        .delete(userLikedRecipes)
        .where(
          and(
            eq(userLikedRecipes.userId, ctx.sessionData.userId),
            eq(userLikedRecipes.recipeId, input.id)
          )
        );
    }),
});

export const userLikedRoutes = t.router({
  recipes: userLikedRecipesRoutes,
});
