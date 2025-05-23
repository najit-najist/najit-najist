import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import {
  SQL,
  and,
  eq,
  getTableName,
  ilike,
  isNotNull,
  or,
  sql,
} from '@najit-najist/database/drizzle';
import { Post, posts, userLikedPosts } from '@najit-najist/database/models';
import { isFileBase64, slugSchema } from '@najit-najist/schemas';
import { EntityLink, entityLinkSchema } from '@najit-najist/schemas';
import { LibraryService } from '@server/services/LibraryService';
import { UserActions, canUser } from '@server/utils/canUser';
import { slugifyString } from '@server/utils/slugifyString';
import { generateCursor } from 'drizzle-cursor';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { postCreateInputSchema } from '../../schemas/postCreateInputSchema';
import { postUpdateInputSchema } from '../../schemas/postUpdateInputSchema';
import { t } from '../instance';
import { onlyAdminProcedure } from '../procedures/onlyAdminProcedure';
import { protectedProcedure } from '../procedures/protectedProcedure';

const getOneBy = async <V extends keyof Post>(by: V, value: Post[V]) => {
  const item = await database.query.posts.findFirst({
    where: (schema, { eq }) => eq(schema[by], value as any),
    with: {
      categories: {
        with: { category: true },
      },
    },
  });

  if (!item) {
    throw new EntityNotFoundError({
      entityName: getTableName(posts),
    });
  }

  return item;
};

const toggleLike = async (options: { user: EntityLink; post: EntityLink }) => {
  const filter = and(
    eq(userLikedPosts.userId, options.user.id),
    eq(userLikedPosts.postId, options.post.id),
  );

  const existing = await database.query.userLikedPosts.findFirst({
    where: filter,
  });

  if (existing) {
    await database.delete(userLikedPosts).where(filter);
  } else {
    await database.insert(userLikedPosts).values({
      postId: options.post.id,
      userId: options.user.id,
    });
  }
};

export const postsRoute = t.router({
  create: onlyAdminProcedure
    .input(postCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      let post: Post;
      const library = new LibraryService(posts);

      try {
        library.beginTransaction();

        post = await database.transaction(async (tx) => {
          let [created] = await tx
            .insert(posts)
            .values({
              ...input,
              slug: slugifyString(input.title),
              createdById: ctx.sessionData.userId,
            })
            .returning();

          if (input.image) {
            const { filename } = await library.create(created, input.image);

            [created] = await tx
              .update(posts)
              .set({
                image: filename,
              })
              .where(eq(posts.id, created.id))
              .returning();
          }

          library.commit();

          return created;
        });
      } catch (error) {
        library.endTransaction();

        logger.error('[POSTS] Failed to create post', { error, input });

        throw error;
      }

      revalidatePath('/clanky');

      return post;
    }),

  update: onlyAdminProcedure
    .input(entityLinkSchema.extend({ data: postUpdateInputSchema }))
    .mutation(async ({ ctx, input }) => {
      let post: Post;
      const library = new LibraryService(posts);
      const existing = await getOneBy('id', input.id);

      try {
        const { image: newImage, ...updateOptions } = input.data;

        post = await database.transaction(async (tx) => {
          library.beginTransaction();

          let [updated] = await tx
            .update(posts)
            .set({
              ...updateOptions,
              ...(updateOptions.title
                ? { slug: slugifyString(updateOptions.title) }
                : null),
              updateById: ctx.sessionData.userId,
              updatedAt: new Date(),
            })
            .where(eq(posts.id, input.id))
            .returning();

          if (newImage && isFileBase64(newImage)) {
            const { filename } = await library.create(updated, newImage);

            const [newlyUpdated] = await tx
              .update(posts)
              .set({
                image: filename,
              })
              .where(eq(posts.id, input.id))
              .returning();

            if (updated.image) {
              await library.delete(updated, updated.image);
            }

            updated = newlyUpdated;
          }

          if (newImage === null && existing.image) {
            [updated] = await tx
              .update(posts)
              .set({
                image: null,
              })
              .where(eq(posts.id, input.id))
              .returning();

            await library.delete(existing, existing.image);
          }

          await library.commit();

          return updated;
        });

        revalidatePath(`/clanky/${post.slug}`);
        revalidatePath('/clanky');

        return post;
      } catch (error) {
        library.endTransaction();

        logger.error('[POSTS] Failed to update post', {
          error,
          input: {
            ...input,
            data: {
              ...input.data,
              image: null,
            },
          },
        });

        throw error;
      }
    }),

  delete: onlyAdminProcedure
    .input(entityLinkSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await getOneBy('id', input.id);

      await database.delete(posts).where(eq(posts.id, input.id));

      revalidatePath(`/clanky/${existing.slug}`);
      revalidatePath('/clanky');

      return;
    }),

  getMany: t.procedure
    .input(
      z
        .object({
          page: z.string().optional(),
          perPage: z.number().min(1).default(20).optional(),
          query: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = { perPage: 20, query: '' } }) => {
      const conditions: SQL[] = [];
      const loggedInUser = ctx.sessionData?.user;

      if (input.query) {
        conditions.push(
          or(
            ilike(posts.title, `%${input.query}%`),
            ilike(posts.description, `%${input.query}%`),
          )!,
        );
      }

      if (
        !loggedInUser ||
        !canUser(loggedInUser, { action: UserActions.UPDATE, onModel: posts })
      ) {
        conditions.push(isNotNull(posts.publishedAt));
      }

      const cursor = generateCursor({
        primaryCursor: {
          order: 'ASC',
          key: posts.id.name,
          schema: posts.id,
        },
        cursors: [
          {
            order: 'DESC',
            key: posts.publishedAt.name,
            schema: posts.publishedAt,
          },
        ],
      });

      const [items, [{ count }]] = await Promise.all([
        database.query.posts.findMany({
          with: {
            categories: {
              with: { category: true },
            },
          },
          limit: input.perPage,
          where: and(...conditions, cursor.where(input.page)),
          orderBy: cursor.orderBy,
        }),
        database
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(posts)
          .where(and(...conditions)),
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

  getOne: t.procedure
    .input(
      z.object({
        slug: slugSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await getOneBy('slug', input.slug);
      const loggedInUser = ctx.sessionData?.user;

      if (
        (!loggedInUser ||
          !canUser(loggedInUser, {
            action: UserActions.UPDATE,
            onModel: posts,
          })) &&
        !post.publishedAt
      ) {
        throw new EntityNotFoundError({ entityName: getTableName(posts) });
      }

      return post;
    }),

  /**
   * @deprecated
   */
  likeOne: protectedProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      await toggleLike({
        post: input,
        user: {
          id: ctx.sessionData.userId,
        },
      });
    }),

  /**
   * @deprecated
   */
  dislikeOne: protectedProcedure
    .input(entityLinkSchema)
    .mutation(async ({ input, ctx }) => {
      await toggleLike({
        post: input,
        user: {
          id: ctx.sessionData.userId,
        },
      });
    }),
});
