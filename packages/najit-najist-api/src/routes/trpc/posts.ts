import { t } from '@trpc';
import { getManyPostsInputSchema, getOnePostInputSchema } from '@schemas';
import { PocketbaseCollections, Post } from '@custom-types';

export const postsRoute = t.router({
  getMany: t.procedure
    .input(getManyPostsInputSchema.optional())
    .query(async ({ ctx, input = { page: 1, perPage: 20 } }) =>
      ctx.pb
        .collection(PocketbaseCollections.POSTS)
        .getList<Post>(input?.page, input?.perPage, {
          expand: `categories`,
        })
    ),

  getOne: t.procedure
    .input(getOnePostInputSchema)
    .query(async ({ ctx, input }) =>
      ctx.pb
        .collection(PocketbaseCollections.POSTS)
        .getFirstListItem<Post>(`slug="${input.slug}"`, {
          expand: `categories`,
        })
    ),
});
