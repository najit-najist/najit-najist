'use client';

import { useEditorJSInstances } from '@contexts/editorJsInstancesContext';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePostInput,
  createPostInputSchema,
  Post,
  UpdateOnePostInput,
  updateOnePostInputSchema,
} from '@najit-najist/api';
import { trpc } from '@trpc';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ViewType } from '../_types';

export const Form: FC<
  PropsWithChildren<{ post?: Post; viewType: ViewType }>
> = ({ post, children, viewType }) => {
  const router = useRouter();
  const editorReferences = useEditorJSInstances();
  const formMethods = useForm<CreatePostInput>({
    defaultValues: post,
    resolver: zodResolver(
      viewType === 'create' ? createPostInputSchema : updateOnePostInputSchema
    ),
  });
  const { handleSubmit } = formMethods;
  const { mutateAsync: updatePost } = trpc.posts.update.useMutation();
  const { mutateAsync: createPost } = trpc.posts.create.useMutation();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      const payload = {
        title: values.title,
        description: values.description,
        content: await editorReferences.get('content')?.save(),
        publishedAt: values.publishedAt,
        image: values.image,
      };

      if (viewType === 'create') {
        const newData = await createPost(payload);

        router.push(`/clanky/${newData.slug}`);
      } else if (viewType === 'edit') {
        const newData = await updatePost({
          id: post!.id,
          data: payload,
        });

        router.push(`/clanky/${newData.slug}?editor=true`);
      }
    },
    [viewType, createPost, editorReferences, post, router, updatePost]
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
