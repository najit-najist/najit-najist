import { FC } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { WrapperProps } from '@react-editor-js/core';
import { EDITORJS_TOOLS } from './constants';

export type EditorProps = Omit<WrapperProps, 'tools'>;
export type EditorCode = Parameters<
  NonNullable<EditorProps['onInitialize']>
>['0'];

const EditorInstance = createReactEditorJS();
export const Editor: FC<EditorProps> = (props) => (
  <EditorInstance tools={EDITORJS_TOOLS} {...props} />
);

export * from './DataRenderer/DataRenderer';
export * from './types';
