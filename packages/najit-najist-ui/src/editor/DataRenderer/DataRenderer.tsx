import type { OutputData } from '@editorjs/editorjs';
import type { FC } from 'react';
import {
  DelimiterRenderer,
  HeaderRenderer,
  ListRenderer,
  ParagraphRenderer,
} from './renderers';

export type DataRendererProps = {
  data: OutputData;
};

const renderers = {
  paragraph: ParagraphRenderer,
  delimiter: DelimiterRenderer,
  header: HeaderRenderer,
  list: ListRenderer,
};

export const DataRenderer: FC<DataRendererProps> = ({ data }) => {
  return (
    <>
      {data.blocks.map((block) => {
        if (block.type.toString() in renderers) {
          // @ts-ignore Todo: find a fix
          const Tag = renderers[block.type];
          return <Tag key={block.id} data={block.data} />;
        }
      })}
    </>
  );
};