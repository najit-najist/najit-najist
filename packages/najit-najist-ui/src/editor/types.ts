import { EditorConfig } from '@editorjs/editorjs';

export type Tool = NonNullable<EditorConfig['tools']>[string];

export type { OutputData } from '@editorjs/editorjs';
