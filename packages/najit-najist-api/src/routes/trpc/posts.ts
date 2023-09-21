import { t } from '@trpc';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';
import {
  createPostInputSchema,
  dislikePostInputSchema,
  getManyPostsInputSchema,
  getOnePostInputSchema,
  likePostInputSchema,
  outputPostSchema,
  updateOnePostInputSchema,
} from '@schemas';
import { PocketbaseCollections, Post } from '@custom-types';
import { slugifyString } from '@utils';
import { pocketbase } from '@najit-najist/pb';
import { z } from 'zod';
import { objectToFormData } from '@utils/internal';
import { revalidatePath } from 'next/cache';
import { UserLikedPostsService } from 'server';

export const postsRoute = t.router({
  create: onlyAdminProcedure
    .input(createPostInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await pocketbase
        .collection(PocketbaseCollections.POSTS)
        .create<Post>(
          await objectToFormData({
            ...input,
            slug: slugifyString(input.title),
            createdBy: ctx.sessionData.userId,
          })
        );

      revalidatePath('/clanky');

      return result;
    }),

  update: onlyAdminProcedure
    .input(z.object({ id: z.string(), data: updateOnePostInputSchema }))
    .mutation(async ({ ctx, input }) => {
      const result = await pocketbase
        .collection(PocketbaseCollections.POSTS)
        .update<Post>(
          input.id,
          await objectToFormData({
            ...input.data,
            updatedBy: ctx.sessionData.userId,
            ...(input.data.title
              ? { slug: slugifyString(input.data.title) }
              : null),
          })
        );

      revalidatePath(`/clanky/${result.slug}`);
      revalidatePath('/clanky');

      return result;
    }),

  delete: onlyAdminProcedure
    .input(outputPostSchema.pick({ id: true, slug: true }))
    .mutation(async ({ ctx, input }) => {
      await pocketbase.collection(PocketbaseCollections.POSTS).delete(input.id);

      revalidatePath(`/clanky/${input.slug}`);
      revalidatePath('/clanky');

      return;
    }),

  getMany: t.procedure
    .input(getManyPostsInputSchema.optional())
    .query(async ({ ctx, input = { page: 1, perPage: 20, query: '' } }) => {
      const filter = [
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
    }),

  getOne: t.procedure
    .input(getOnePostInputSchema)
    .query(async ({ ctx, input }) =>
      pocketbase
        .collection(PocketbaseCollections.POSTS)
        .getFirstListItem<Post>(`slug="${decodeURIComponent(input.slug)}"`, {
          expand: `categories`,
        })
    ),

  likeOne: protectedProcedure
    .input(likePostInputSchema)
    .mutation(async ({ input, ctx }) => {
      UserLikedPostsService.create({
        likedBy: ctx.sessionData.userId,
        likedItem: input.id,
      });
    }),

  dislikeOne: protectedProcedure
    .input(dislikePostInputSchema)
    .mutation(async ({ input, ctx }) => {
      const recipe = await UserLikedPostsService.getOne({
        likedItem: input.itemId,
      });

      await UserLikedPostsService.delete(recipe.id);
    }),
});
