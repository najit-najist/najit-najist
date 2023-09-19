import { cx } from 'class-variance-authority';
import { forwardRef, useCallback, useId, useState } from 'react';
import Quill, { ReactQuillProps } from 'react-quill';
import { FormControlWrapper, FormControlWrapperProps } from '../form';

type QuillProp<T extends keyof ReactQuillProps> = NonNullable<
  ReactQuillProps[T]
>;

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    // ['link', 'image'],
    ['clean'],
  ],
};

export const QuillEditor = forwardRef<
  Quill,
  ReactQuillProps &
    Pick<
      FormControlWrapperProps,
      'title' | 'description' | 'required' | 'error'
    > & { rootClassName?: string }
>(function QuillEditor(
  {
    onChangeSelection,
    className,
    title,
    description,
    error,
    required,
    rootClassName,
    ...rest
  },
  ref
) {
  const id = useId();
  const [isFocusing, setIsFocusing] = useState(false);

  const handleSelectionChange = useCallback<QuillProp<'onChangeSelection'>>(
    (range, oldRange, source) => {
      if (range === null && oldRange !== null) {
        setIsFocusing(false);
      } else if (range !== null) {
        setIsFocusing(true);
      }
      onChangeSelection?.(range, oldRange, source);
    },
    [onChangeSelection]
  );

  return (
    <FormControlWrapper
      title={title}
      description={description}
      error={error}
      required={required}
      id={id}
      className={rootClassName}
    >
      <Quill
        ref={ref}
        className={cx([isFocusing ? 'is-focusing' : '', className])}
        onChangeSelection={handleSelectionChange}
        modules={modules}
        {...rest}
      />
    </FormControlWrapper>
  );
});

export type { ReactQuillProps, Quill };
