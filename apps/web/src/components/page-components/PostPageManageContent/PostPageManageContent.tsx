import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { AvailableModels, getFileUrl, Post } from '@najit-najist/api';
import HTMLReactParser from 'html-react-parser';
import { BlockEditorRenderer } from '@najit-najist/ui/editor-renderer';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FC } from 'react';
import { ContentEdit } from './editorComponents/ContentEdit';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { Form } from './editorComponents/Form';
import { ImageEdit } from './editorComponents/ImageEdit';
import { PublishedAtEdit } from './editorComponents/PublishedAtEdit';
import { TitleEdit } from './editorComponents/TitleEdit';
import { EditorHeader } from './EditorHeader';

export type PostPageManageContent = { isEditorHeaderShown?: boolean } & (
  | { viewType: 'edit'; post: Post }
  | {
      viewType: 'view';
      post: Post;
    }
  | { viewType: 'create' }
);

export const PostPageManageContent: FC<PostPageManageContent> = (props) => {
  const content = (
    <>
      <div>
        <PageHeader className="container">
          {props.viewType == 'view' ? (
            <time
              dateTime={props.post.publishedAt as string}
              className="text-gray-500 font-semibold"
            >
              {dayjs(props.post.publishedAt).format('DD. MM. YYYY @ HH:mm')}
            </time>
          ) : (
            <PublishedAtEdit />
          )}
          {props.viewType == 'view' ? (
            <PageTitle>{props.post.title}</PageTitle>
          ) : (
            <TitleEdit />
          )}
        </PageHeader>

        <div className="bg-[#388659] py-10 my-7">
          <div className="container flex items-start space-x-10">
            {props.viewType !== 'view' || props.post.image ? (
              <div className="w-1/2 aspect-[16/10] relative flex-none  rounded-md overflow-hidden shadow-sm">
                {props.viewType === 'view' ? (
                  <Image
                    width={300}
                    height={300}
                    unoptimized
                    src={getFileUrl(
                      AvailableModels.POST,
                      props.post.id,
                      props.post.image
                    )}
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

            <div className="font-suez text-xl leading-9 max-w-4xl w-full">
              {props.viewType === 'view' ? (
                <p className="text-white">
                  {HTMLReactParser(props.post.description)}
                </p>
              ) : (
                <DescriptionEdit />
              )}
            </div>
          </div>
        </div>

        <div className="container text-xl pb-10">
          {props.viewType === 'view' ? (
            props.post.content ? (
              <BlockEditorRenderer data={props.post.content} />
            ) : null
          ) : (
            <ContentEdit />
          )}
        </div>
      </div>
      {props.isEditorHeaderShown ? (
        <EditorHeader viewType={props.viewType} />
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
