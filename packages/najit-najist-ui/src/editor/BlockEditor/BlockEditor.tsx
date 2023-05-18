import { FC } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { WrapperProps } from '@react-editor-js/core';
import { EDITORJS_TOOLS } from './constants';

export type BlockEditorProps = Omit<WrapperProps, 'tools'>;
export type BlockEditorCode = Parameters<
  NonNullable<BlockEditorProps['onInitialize']>
>['0'];

const BlockEditorInstance = createReactEditorJS();
export const BlockEditor: FC<BlockEditorProps> = (props) => (
  <BlockEditorInstance tools={EDITORJS_TOOLS} {...props} />
);
