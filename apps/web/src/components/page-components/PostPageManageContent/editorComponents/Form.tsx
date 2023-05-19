'use client';

import { useEditorJSInstances } from '@contexts/editorJsInstancesContext';
import { Post, Recipe } from '@najit-najist/api';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ViewType } from '../_types';

export const Form: FC<
  PropsWithChildren<{ post?: Post; viewType: ViewType }>
> = ({ post, children, viewType }) => {
  const router = useRouter();
  const editorReferences = useEditorJSInstances();
  const formMethods = useForm<Recipe>({
    defaultValues: post,
  });
  const { handleSubmit } = formMethods;
  const { mutateAsync: updatePost } = trpc.posts.update.useMutation();
  const { mutateAsync: createPost } = trpc.posts.create.useMutation();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      if (viewType === 'create') {
        const newData = await createPost({
          title: values.title,
          description: values.description,
          content: await editorReferences.get('content')?.save(),
        });

        router.push(`/clanky/${newData.slug}`);
      } else if (viewType === 'edit') {
        const newData = await updatePost({
          id: values.id,
          data: {
            title: values.title,
            content: await editorReferences.get('content')?.save(),
            description: values.description,
          },
        });

        if (newData.slug !== newData.slug) {
          router.push(`/clanky/${newData.slug}?editor=true`);
        } else {
          router.refresh();
        }
      }
    },
    [viewType, createPost, editorReferences, router, updatePost]
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
