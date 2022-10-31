import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useId,
} from 'react';
import { FormControlWrapper } from './FormControlWrapper';
import { useFormClassNames } from './hooks';
import clsx from 'clsx';

type ParentProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'id'
>;
export interface InputProps extends ParentProps {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { name, label, error, className, wrapperClassName, required, ...restProps },
  ref
) {
  const classNames = useFormClassNames();
  const inputId = useId();

  return (
    <FormControlWrapper
      className={wrapperClassName}
      title={label}
      error={error}
      required={required}
      id={inputId}
    >
      <input
        className={clsx(classNames.input, className)}
        ref={ref}
        id={inputId}
        name={name}
        {...restProps}
      />
    </FormControlWrapper>
  );
});
