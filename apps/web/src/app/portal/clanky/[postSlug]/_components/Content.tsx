'use client';

import { Post } from '@najit-najist/api';
import { Button, FormBreak, Input, Paper, Switch } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useRef } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import type { BlockEditorCode } from '@najit-najist/ui/editor';
import { trpc } from '@trpc';
import { PostFormContent } from '../../_components/PostFormContent';
import { PostPageLayout } from '../../_components/PostPageLayout';
import Link from 'next/link';
import { Breadcrumbs } from '@components/portal';
import dayjs from 'dayjs';
import {
  DATABASE_TIME_FORMAT,
  DATETIME_LOCAL_INPUT_FORMAT,
  DEFAULT_DATE_FORMAT,
} from '@constants';

export const Content: FC<{ post: Post }> = ({ post }) => {
  const formMethods = useForm({
    defaultValues: post,
  });
  const router = useRouter();
  const { mutateAsync: update } = trpc.posts.update.useMutation();
  const contentEditorRef = useRef<BlockEditorCode>();
  const { formState, handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<Post> = useCallback(
    async (data) => {
      const newData = await update({
        id: data.id,
        data: {
          title: data.title,
          content: await contentEditorRef.current?.save(),
          publishedAt: data.publishedAt,
          description: data.description,
        },
      });

      if (newData.slug !== data.slug) {
        router.push(`/portal/clanky/${newData.slug}`);
      } else {
        router.refresh();
      }
    },
    [router, update]
  );

  const breaker = <FormBreak className="my-5" />;

  const asideContent = (
    <Paper className="p-2 sm:p-5">
      <div className="grid gap-5">
        <Controller
          name="publishedAt"
          render={({ field: { onChange, value, onBlur, name, ref } }) => {
            const isPublished = Boolean(value);

            return (
              <>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                    Publikováno?
                  </label>

                  <Switch
                    onChange={(nextSwitchValue) => {
                      if (!nextSwitchValue) {
                        onChange(dayjs().format(DATABASE_TIME_FORMAT));
                      } else {
                        onChange(null);
                      }
                      onBlur();
                    }}
                    value={isPublished}
                    description="Publikováno?"
                  />
                </div>
                {isPublished ? (
                  <Input
                    ref={ref}
                    label="Publikováno dne"
                    type="datetime-local"
                    name={name}
                    onBlur={onBlur}
                    value={dayjs(value).format(DATETIME_LOCAL_INPUT_FORMAT)}
                    onChange={(event) => {
                      onChange(
                        dayjs(event.target.value).format(DATABASE_TIME_FORMAT)
                      );
                    }}
                  />
                ) : null}
              </>
            );
          }}
        />
      </div>

      {breaker}

      <div className="grid gap-5">
        <Input
          label="Vytvořeno dne"
          value={dayjs(post.created).format(DEFAULT_DATE_FORMAT)}
          disabled
        />

        <Input
          label="Upraveno dne"
          value={dayjs(post.updated).format(DEFAULT_DATE_FORMAT)}
          disabled
        />
      </div>

      <div className="flex justify-between items-center mt-7">
        <Link
          href={`/clanky/${post.slug}`}
          className="text-sm text-blue-700 hover:underline"
        >
          Zobrazit
        </Link>
        <Button isLoading={formState.isSubmitting}>Uložit</Button>
      </div>
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
              { content: 'Úprava článku' },

              {
                // @ts-ignore
                link: `/portal/clanky/${post.slug}`,
                content: post.title,
              },
            ]}
          />

          <PostFormContent />
        </PostPageLayout>
      </form>
    </FormProvider>
  );
};
