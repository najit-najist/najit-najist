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
import { Tool } from './types';
import {
  AVAILABLE_LEVELS,
  DEFAULT_LEVEL,
} from '../BlockEditorRenderer/renderers';

export const EDITORJS_TOOLS = {
  paragraph: {
    class: ParagraphPlugin,
    inlineToolbar: true,
    config: { placeholder: 'Text zde...' },
  } as Tool,
  delimiter: DelimiterPlugin as Tool,
  header: {
    class: HeaderPlugin,
    inlineToolbar: true,
    config: {
      placeholder: 'Zadejte titulek...',
      levels: AVAILABLE_LEVELS,
      defaultLevel: DEFAULT_LEVEL,
    },
  } as Tool,
  link: LinkPlugin as Tool,
  list: ListPlugin as Tool,
  underline: UnderlinePlugin as Tool,
} as const;
