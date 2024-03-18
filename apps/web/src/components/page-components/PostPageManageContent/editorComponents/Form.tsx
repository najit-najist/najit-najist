'use client';

import { useEditorJSInstances } from '@contexts/editorJsInstancesContext';
import { PostWithRelations } from '@custom-types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  postCreateInputSchema,
  postUpdateInputSchema,
} from '@najit-najist/api';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ViewType } from '../_types';

type FormData = z.infer<typeof postCreateInputSchema>;

export const Form: FC<
  PropsWithChildren<{ post?: PostWithRelations; viewType: ViewType }>
> = ({ post, children, viewType }) => {
  const router = useRouter();
  const editorReferences = useEditorJSInstances();
  const formMethods = useForm<FormData>({
    defaultValues: {
      ...post,
      content: post?.content ? JSON.parse(post.content) : null,
    },
    resolver: zodResolver(
      viewType === 'create' ? postCreateInputSchema : postUpdateInputSchema
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
