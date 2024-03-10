import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PostWithRelations } from '@custom-types';
import { getFileUrl } from '@najit-najist/api';
import { posts } from '@najit-najist/database/models';
import { Breadcrumbs } from '@najit-najist/ui';
import { BlockEditorRenderer } from '@najit-najist/ui/editor-renderer';
import dayjs from 'dayjs';
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
            <div className="text-gray-500 text-xs md:text-inherit -mt-2 block relative">
              {props.post.publishedAt ? (
                <time dateTime={String(props.post.publishedAt)} className="">
                  {dayjs(props.post.publishedAt).format('DD. MM. YYYY @ HH:mm')}
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

        <div className="bg-[#388659] py-7 sm:py-10 my-7">
          <div className="container flex items-start space-x-10">
            {props.viewType !== 'view' || props.post.image ? (
              <div className="w-full sm:w-1/2 aspect-[16/10] relative flex-none rounded-md overflow-hidden shadow-sm">
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

            <div className="font-title sm:text-xl leading-9 spacing max-w-4xl tracking-wide w-full">
              {props.viewType === 'view' ? (
                <div className="text-white">
                  {HTMLReactParser(props.post.description)}
                </div>
              ) : (
                <DescriptionEdit />
              )}
            </div>
          </div>
        </div>

        <div className="container sm:text-lg pb-10 post-page-content">
          {props.viewType === 'view' ? (
            props.post.content ? (
              <BlockEditorRenderer data={JSON.parse(props.post.content)} />
            ) : null
          ) : (
            <ContentEdit />
          )}
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
