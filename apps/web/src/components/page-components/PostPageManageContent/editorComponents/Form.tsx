'use client';

import { trpc } from '@client/trpc';
import { useEditorJSInstances } from '@contexts/editorJsInstancesContext';
import { PostWithRelations } from '@custom-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@najit-najist/ui';
import { postCreateInputSchema } from '@server/schemas/postCreateInputSchema';
import { postUpdateInputSchema } from '@server/schemas/postUpdateInputSchema';
import { handlePromiseForToast } from '@utils/handleActionForToast';
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
    defaultValues: post,
    resolver: zodResolver(
      viewType === 'create' ? postCreateInputSchema : postUpdateInputSchema,
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
        content: values.content,
        publishedAt: values.publishedAt,
        image: values.image,
      };

      if (viewType === 'create') {
        const action = createPost(payload);

        toast.promise(handlePromiseForToast(action), {
          loading: 'Vytvářím článek',
          success: <>Článek vytvořen!</>,
          error: (error) => <b>Nemohli jsme vytvořit článek {error.message}</b>,
        });

        const newData = await action;
        router.push(`/clanky/${newData.slug}`);
      } else if (viewType === 'edit') {
        const action = updatePost({
          id: post!.id,
          data: payload,
        });

        toast.promise(handlePromiseForToast(action), {
          loading: 'Ukládám článek',
          success: <>Článek uložen!</>,
          error: (error) => <b>Nemohli jsme uložit článek {error.message}</b>,
        });

        const newData = await action;

        router.push(`/administrace/clanky/${newData.slug}`);
      }
    },
    [viewType, createPost, editorReferences, post, router, updatePost],
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
