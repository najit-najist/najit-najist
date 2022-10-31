import {
  DetailedHTMLProps,
  forwardRef,
  TextareaHTMLAttributes,
  useId,
} from 'react';
import { FormControlWrapper } from './FormControlWrapper';
import { useFormClassNames } from './hooks';
import clsx from 'clsx';

type ParentProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'id'
>;
export interface InputProps extends ParentProps {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, InputProps>(
  function Textarea(
    { name, label, error, className, wrapperClassName, ...restProps },
    ref
  ) {
    const classNames = useFormClassNames();
    const inputId = useId();

    return (
      <FormControlWrapper
        className={wrapperClassName}
        title={label}
        error={error}
        id={inputId}
      >
        <textarea
          className={clsx(classNames.input, className)}
          ref={ref}
          id={inputId}
          name={name}
          {...restProps}
        />
      </FormControlWrapper>
    );
  }
);
