// @ts-ignore
// @ts-ignore
import DelimiterPlugin from '@editorjs/delimiter';
import { ToolConstructable, ToolSettings } from '@editorjs/editorjs';
// @ts-ignore
import HeaderPlugin from '@editorjs/header';
// @ts-ignore
import LinkPlugin from '@editorjs/link';
// @ts-ignore
import ListPlugin from '@editorjs/nested-list';
// @ts-ignore
import ParagraphPlugin from '@editorjs/paragraph';
// @ts-ignore
import UnderlinePlugin from '@editorjs/underline';

import {
  AVAILABLE_LEVELS,
  DEFAULT_LEVEL,
} from '../DataRenderer/renderers/HeaderRenderer.js';
import { Tool } from '../types.js';

export const EDITORJS_TOOLS: {
  [toolName: string]: ToolConstructable | ToolSettings;
} = {
  paragraph: {
    class: ParagraphPlugin,
    inlineToolbar: true,
    config: { placeholder: 'Začnete psát kliknutím...' },
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
};
