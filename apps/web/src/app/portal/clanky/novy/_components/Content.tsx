'use client';

import { createPostInputSchema } from '@najit-najist/api';
import { Button, FormBreak, Paper } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useRef } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import type { EditorCode } from '@najit-najist/ui/editor';
import { trpc } from '@trpc';
import { PostFormContent } from '../../_components/PostFormContent';
import { PostPageLayout } from '../../_components/PostPageLayout';
import { Breadcrumbs } from '@components/portal';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { DATABASE_TIME_FORMAT } from '@constants';

type PostInput = z.input<typeof createPostInputSchema>;

export const Content: FC = () => {
  const formMethods = useForm<PostInput>({
    defaultValues: {},
    resolver: zodResolver(createPostInputSchema),
  });
  const router = useRouter();
  const { mutateAsync: create } = trpc.posts.create.useMutation();
  const contentEditorRef = useRef<EditorCode>();
  const { formState, handleSubmit, setValue } = formMethods;
  const saveFormButtonRef = useRef<HTMLButtonElement>(null);

  const onSubmit: SubmitHandler<PostInput> = useCallback(
    async (data) => {
      const res = await create({
        title: data.title,
        content: await contentEditorRef.current?.save(),
        publishedAt: data.publishedAt,
        description: data.description,
      });

      router.push(`/portal/clanky/${res.slug}`);
    },
    [router, create]
  );

  const asideContent = (
    <Paper className="p-2 sm:p-5 flex justify-between items-center mt-7">
      <Button
        color="blue"
        size="small"
        isLoading={formState.isSubmitting}
        ref={saveFormButtonRef}
      >
        Uložit
      </Button>
      <Button
        isLoading={formState.isSubmitting}
        type="button"
        onClick={() => {
          setValue('publishedAt', dayjs().format(DATABASE_TIME_FORMAT));
          saveFormButtonRef.current?.click();
        }}
      >
        Publikovat
      </Button>
    </Paper>
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PostPageLayout asideContent={asideContent}>
          <Breadcrumbs
            className="mb-5"
            items={[
              { link: '/portal/clanky', content: 'Články' },
              { link: '/portal/clanky/novy', content: 'Vytvoření článku' },
            ]}
          />

          <PostFormContent
            onEditorInit={(editor) => (contentEditorRef.current = editor)}
          />
        </PostPageLayout>
      </form>
    </FormProvider>
  );
};
