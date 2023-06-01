import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import {
  createPostInputSchema,
  getManyPostsInputSchema,
  getOnePostInputSchema,
  updateOnePostInputSchema,
} from '@schemas';
import { PocketbaseCollections, Post } from '@custom-types';
import { slugify } from '@utils';
import { pocketbase } from '@najit-najist/pb';
import { z } from 'zod';

export const postsRoute = t.router({
  create: protectedProcedure
    .input(createPostInputSchema)
    .mutation(async ({ ctx, input }) =>
      pocketbase.collection(PocketbaseCollections.POSTS).create<Post>({
        ...input,
        slug: slugify(input.title),
        createdBy: ctx.sessionData.userId,
      })
    ),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateOnePostInputSchema }))
    .mutation(async ({ ctx, input }) =>
      pocketbase
        .collection(PocketbaseCollections.POSTS)
        .update<Post>(input.id, {
          ...input.data,
          updateBy: ctx.sessionData.userId,
          ...(input.data.title ? { slug: slugify(input.data.title) } : null),
        })
    ),

  getMany: t.procedure
    .input(getManyPostsInputSchema.optional())
    .query(
      async ({
        ctx,
        input = { page: 1, perPage: 20, onlyPublished: true, query: '' },
      }) => {
        const filter = [
          input.onlyPublished ? `publishedAt != null` : undefined,
          input.query
            ? `(title ~ '${input.query}' || description ~ '${input.query}')`
            : undefined,
        ]
          .filter(Boolean)
          .join(' && ');

        return pocketbase
          .collection(PocketbaseCollections.POSTS)
          .getList<Post>(input?.page, input?.perPage, {
            filter,
            expand: `categories`,
            sort: '-publishedAt',
          });
      }
    ),

  getOne: t.procedure
    .input(getOnePostInputSchema)
    .query(async ({ ctx, input }) =>
      pocketbase
        .collection(PocketbaseCollections.POSTS)
        .getFirstListItem<Post>(`slug="${input.slug}"`, {
          expand: `categories`,
        })
    ),
});
