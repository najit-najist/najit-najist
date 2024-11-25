import type { OutputData } from '@editorjs/editorjs';
import type { FC } from 'react';

import { DelimiterRenderer } from './renderers/DelimiterRenderer';
import { HeaderRenderer } from './renderers/HeaderRenderer';
import { ListRenderer } from './renderers/ListRenderer';
import { ParagraphRenderer } from './renderers/Paragraph';

export type DataRendererProps = {
  data: OutputData;
};

const renderers = {
  paragraph: ParagraphRenderer,
  delimiter: DelimiterRenderer,
  header: HeaderRenderer,
  list: ListRenderer,
};

/**
 * Renders editor.js output to html
 */
export const BlockEditorRenderer: FC<DataRendererProps> = ({ data }) => {
  return (
    <>
      {data?.blocks?.map((block) => {
        if (block.type.toString() in renderers) {
          // @ts-ignore Todo: find a fix
          const Tag = renderers[block.type];
          return <Tag key={block.id} data={block.data} />;
        }
      })}
    </>
  );
};
