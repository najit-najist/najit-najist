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
    .input(updateOnePostInputSchema)
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
      async ({ ctx, input = { page: 1, perPage: 20, onlyPublished: true } }) =>
        pocketbase
          .collection(PocketbaseCollections.POSTS)
          .getList<Post>(input?.page, input?.perPage, {
            filter: input.onlyPublished ? `publishedAt != null` : undefined,
            expand: `categories`,
            sort: '-publishedAt',
          })
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
