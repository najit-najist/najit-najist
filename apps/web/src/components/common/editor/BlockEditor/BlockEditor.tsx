import { WrapperProps } from '@react-editor-js/core';

import { FormControlWrapperProps } from '../../form/FormControlWrapper';

export type BlockEditorProps = Omit<WrapperProps, 'tools'> &
  Pick<FormControlWrapperProps, 'title' | 'error'>;
export type BlockEditorCode = Parameters<
  NonNullable<BlockEditorProps['onInitialize']>
>['0'];

// export const BlockEditor: FC<BlockEditorProps> = ({
//   title,
//   error,
//   ...props
// }) => {
//   const id = useId();

//   return (
//     <FormControlWrapper id={id} title={title} error={error}>
//       <BlockEditorInstance
//         tools={EDITORJS_TOOLS}
//         defaultBlock={'paragraph'}
//         placeholder="Let`s write an awesome story!"
//         minHeight={400}
//         onReady={console.log}
//         {...props}
//       />
//     </FormControlWrapper>
//   );
// };
