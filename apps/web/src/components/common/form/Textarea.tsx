import { cx } from 'class-variance-authority';
import {
  DetailedHTMLProps,
  forwardRef,
  TextareaHTMLAttributes,
  useId,
} from 'react';
import { FieldError } from 'react-hook-form';

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
  error?: string | FieldError;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { name, label, error, className, wrapperClassName, disabled, ...restProps },
    ref,
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
          className={inputStyles({
            className: cx(className, label ? 'mt-1' : ''),
            disabled,
          })}
          ref={ref}
          id={inputId}
          name={name}
          disabled={disabled}
          {...restProps}
        />
      </FormControlWrapper>
    );
  },
);
