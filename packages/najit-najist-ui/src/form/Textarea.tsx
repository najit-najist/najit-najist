import {
  DetailedHTMLProps,
  forwardRef,
  TextareaHTMLAttributes,
  useId,
} from 'react';
import { FormControlWrapper } from './FormControlWrapper';
import { inputStyles } from './Input';

type ParentProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'id'
>;
export interface TextareaProps extends ParentProps {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { name, label, error, className, wrapperClassName, ...restProps },
    ref
  ) {
    const inputId = useId();

    return (
      <FormControlWrapper
        className={wrapperClassName}
        title={label}
        error={error}
        id={inputId}
      >
        <textarea
          className={inputStyles({ className })}
          ref={ref}
          id={inputId}
          name={name}
          {...restProps}
        />
      </FormControlWrapper>
    );
  }
);
