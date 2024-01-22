import {
  ErrorCodes,
  PocketbaseCollections,
  Post,
  UserLikedPost,
} from '@custom-types';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import {
  createPostInputSchema,
  dislikePostInputSchema,
  getManyPostsInputSchema,
  getOnePostInputSchema,
  likePostInputSchema,
  outputPostSchema,
  updateOnePostInputSchema,
} from '@schemas';
import { t } from '@trpc';
import {
  onlyAdminProcedure,
  protectedProcedure,
} from '@trpc-procedures/protectedProcedure';
import { slugifyString } from '@utils';
import { objectToFormData } from '@utils/internal';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { AUTHORIZATION_HEADER } from '../..';
import { ApplicationError } from '../../errors/ApplicationError';

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
          }),
          {
            headers: { [AUTHORIZATION_HEADER]: ctx.sessionData?.token },
          }
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
          }),
          {
            headers: { [AUTHORIZATION_HEADER]: ctx.sessionData?.token },
          }
        );

      revalidatePath(`/clanky/${result.slug}`);
      revalidatePath('/clanky');

      return result;
    }),

  delete: onlyAdminProcedure
    .input(outputPostSchema.pick({ id: true, slug: true }))
    .mutation(async ({ ctx, input }) => {
      await pocketbase
        .collection(PocketbaseCollections.POSTS)
        .delete(input.id, {
          headers: { [AUTHORIZATION_HEADER]: ctx.sessionData?.token },
        });

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
          headers: ctx.sessionData?.token
            ? { [AUTHORIZATION_HEADER]: ctx.sessionData?.token }
            : undefined,
        });
    }),

  getOne: t.procedure
    .input(getOnePostInputSchema)
    .query(async ({ ctx, input }) =>
      pocketbase
        .collection(PocketbaseCollections.POSTS)
        .getFirstListItem<Post>(`slug="${input.slug}"`, {
          expand: `categories`,
          headers: ctx.sessionData?.token
            ? { [AUTHORIZATION_HEADER]: ctx.sessionData?.token }
            : undefined,
        })
    ),

  likeOne: protectedProcedure
    .input(likePostInputSchema)
    .mutation(async ({ input, ctx }) => {
      await pocketbase
        .collection(PocketbaseCollections.USER_LIKED_POSTS)
        .create<UserLikedPost>(
          {
            likedBy: ctx.sessionData.userId,
            likedItem: input.id,
          },
          { headers: { [AUTHORIZATION_HEADER]: ctx.sessionData.token } }
        );
    }),

  dislikeOne: protectedProcedure
    .input(dislikePostInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const requestOptions = {
          headers: { [AUTHORIZATION_HEADER]: ctx.sessionData.token },
        };
        const likedPost = await pocketbase
          .collection(PocketbaseCollections.USER_LIKED_RECIPES)
          .getFirstListItem<UserLikedPost>(
            `likedItem="${input.itemId}"`,
            requestOptions
          );

        await pocketbase
          .collection(PocketbaseCollections.USER_LIKED_POSTS)
          .delete(likedPost.id, requestOptions);
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 400) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Tento like neexistuje`,
            origin: 'UserService',
          });
        }

        throw error;
      }
    }),
});
