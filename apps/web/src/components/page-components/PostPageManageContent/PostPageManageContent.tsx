import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PostWithRelations } from '@custom-types';
import { dayjs } from '@dayjs';
import { posts } from '@najit-najist/database/models';
import { Breadcrumbs } from '@najit-najist/ui';
import { getFileUrl } from '@server/utils/getFileUrl';
import clsx from 'clsx';
import HTMLReactParser from 'html-react-parser';
import Image from 'next/image';
import { FC } from 'react';

import { EditorHeader } from './EditorHeader';
import { ContentEdit } from './editorComponents/ContentEdit';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { Form } from './editorComponents/Form';
import { ImageEdit } from './editorComponents/ImageEdit';
import { PublishedAtEdit } from './editorComponents/PublishedAtEdit';
import { TitleEdit } from './editorComponents/TitleEdit';

export type PostPageManageContent = { isEditorHeaderShown?: boolean } & (
  | { viewType: 'edit'; post: PostWithRelations }
  | {
      viewType: 'view';
      post: PostWithRelations;
    }
  | { viewType: 'create' }
);

export const PostPageManageContent: FC<PostPageManageContent> = (props) => {
  const isImageShown = props.viewType !== 'view' || props.post.image;
  const content = (
    <>
      <div className="container mt-6 mb-3">
        <Breadcrumbs
          items={[
            { link: '/clanky', text: 'Články' },
            ...(props.viewType !== 'create'
              ? [
                  {
                    link: `/clanky/${props.post.slug}`,
                    text: props.post.title,
                    active: true,
                  },
                ]
              : [
                  {
                    link: '/clanky/novy',
                    text: 'Nový',
                    active: true,
                  },
                ]),
          ]}
        />
      </div>
      <div>
        <PageHeader className="container">
          {props.viewType == 'view' ? (
            <div className="text-gray-500 text-xs md:text-inherit block mb-8 relative">
              {props.post.publishedAt ? (
                <time dateTime={String(props.post.publishedAt)} className="">
                  {dayjs
                    .tz(props.post.publishedAt)
                    .format('DD. MM. YYYY @ HH:mm')}
                </time>
              ) : (
                <p className="text-red-500">Nepublikováno</p>
              )}
            </div>
          ) : (
            <PublishedAtEdit />
          )}
          {props.viewType == 'view' ? (
            <PageTitle>{props.post.title}</PageTitle>
          ) : (
            <TitleEdit />
          )}
        </PageHeader>

        <div className="pt-4 pb-8 sm:pb-10">
          <div
            className={clsx(
              'grid grid-cols-1',
              isImageShown ? 'lg:grid-cols-2 gap-9 lg:gap-10' : 'lg:grid-cols-3'
            )}
          >
            <div
              className={clsx(
                'bg-[#388659] h-full lg:rounded-r-lg shadow-lg p-4',
                isImageShown ? '' : 'col-span-2'
              )}
            >
              <div
                className={clsx(
                  'font-title sm:text-2xl mx-auto lg:ml-auto lg:mr-0 !leading-[2.5rem] tracking-wide w-full h-full max-w-[640px] md:max-w-3xl',
                  isImageShown ? 'lg:max-w-2xl' : 'lg:max-w-[63rem]'
                )}
              >
                {props.viewType === 'view' ? (
                  <div className="text-gray-100">
                    {HTMLReactParser(props.post.description)}
                  </div>
                ) : (
                  <DescriptionEdit />
                )}
              </div>
            </div>
            <div className="-order-1 lg:order-1 px-4 lg:px-0">
              {isImageShown ? (
                <div className="w-full aspect-[16/10] mx-auto lg:mr-auto lg:ml-0 max-w-[640px] md:max-w-3xl lg:max-w-[900px] relative flex-none rounded-md overflow-hidden shadow-sm">
                  {props.viewType === 'view' ? (
                    <Image
                      width={300}
                      height={300}
                      unoptimized
                      src={getFileUrl(posts, props.post.id, props.post.image!)}
                      alt=""
                      className="absolute inset-0 h-full w-full rounded-lg bg-gray-50 object-cover shadow-md"
                    />
                  ) : (
                    <ImageEdit
                      postId={
                        props.viewType == 'edit' ? props.post.id : undefined
                      }
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="container sm:text-lg pb-10 post-page-content font-title w-full">
          <div className="prose lg:prose-xl max-w-none w-full">
            {props.viewType === 'view' ? (
              props.post.content ? (
                HTMLReactParser(props.post.content ?? '')
              ) : null
            ) : (
              <ContentEdit />
            )}
          </div>
        </div>
      </div>
      {props.isEditorHeaderShown ? (
        <EditorHeader
          post={
            props.viewType === 'edit'
              ? { id: props.post.id, slug: props.post.slug }
              : undefined
          }
          viewType={props.viewType}
        />
      ) : null}
    </>
  );

  if (props.viewType === 'view') {
    return content;
  }

  return (
    <Form
      viewType={props.viewType}
      post={props.viewType === 'edit' ? props.post : undefined}
    >
      {content}
    </Form>
  );
};
