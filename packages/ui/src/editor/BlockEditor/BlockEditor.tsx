import { WrapperProps } from '@react-editor-js/core';
import { FC, useId } from 'react';
import { createReactEditorJS } from 'react-editor-js';

import {
  FormControlWrapper,
  FormControlWrapperProps,
} from '../../form/FormControlWrapper.js';
import { EDITORJS_TOOLS } from './constants.js';

export type BlockEditorProps = Omit<WrapperProps, 'tools'> &
  Pick<FormControlWrapperProps, 'title' | 'error'>;
export type BlockEditorCode = Parameters<
  NonNullable<BlockEditorProps['onInitialize']>
>['0'];

const BlockEditorInstance = createReactEditorJS();

export const BlockEditor: FC<BlockEditorProps> = ({
  title,
  error,
  ...props
}) => {
  const id = useId();

  return (
    <FormControlWrapper id={id} title={title} error={error}>
      <BlockEditorInstance
        tools={EDITORJS_TOOLS}
        defaultBlock={'paragraph'}
        placeholder="Let`s write an awesome story!"
        minHeight={400}
        onReady={console.log}
        {...props}
      />
    </FormControlWrapper>
  );
};
