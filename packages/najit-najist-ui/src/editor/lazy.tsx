import { FC } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { WrapperProps } from '@react-editor-js/core';
// @ts-ignore
import ParagraphPlugin from '@editorjs/paragraph';
// @ts-ignore
import DelimiterPlugin from '@editorjs/delimiter';
// @ts-ignore
import HeaderPlugin from '@editorjs/header';
// @ts-ignore
import LinkPlugin from '@editorjs/link';
// @ts-ignore
import ListPlugin from '@editorjs/nested-list';
// @ts-ignore
import UnderlinePlugin from '@editorjs/underline';
import { EditorConfig } from '@editorjs/editorjs';

export const EDITORJS_TOOLS: EditorConfig['tools'] = {
  paragraph: {
    class: ParagraphPlugin,
    inlineToolbar: true,
    config: { placeholder: 'Text zde...' },
  },
  delimiter: DelimiterPlugin,
  header: {
    class: HeaderPlugin,
    config: {
      placeholder: 'Zadejte titulek...',
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  link: LinkPlugin,
  list: ListPlugin,
  underline: UnderlinePlugin,
};

const Editor = createReactEditorJS();

const LazyEditor: FC<Omit<WrapperProps, 'tools'>> = (props) => (
  <Editor tools={EDITORJS_TOOLS} {...props} />
);

export default LazyEditor;
