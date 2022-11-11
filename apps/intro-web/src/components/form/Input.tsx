import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useId,
} from 'react';
import { FormControlWrapper } from './FormControlWrapper';
import { useFormClassNames } from './hooks';
import { CheckIcon } from '@heroicons/react/20/solid';
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
  const isCheckbox = restProps.type === 'checkbox';

  return (
    <FormControlWrapper
      className={clsx(
        wrapperClassName,
        isCheckbox &&
          'flex flex-row-reverse justify-end items-center cursor-pointer'
      )}
      title={label}
      error={error}
      required={required}
      id={inputId}
      type={restProps.type}
    >
      <input
        className={clsx(
          classNames.input,
          isCheckbox && 'hidden checkbox',
          className
        )}
        ref={ref}
        id={inputId}
        name={name}
        {...restProps}
      />
      {isCheckbox && (
        <>
          <span className="ring-2 ring-[#87a893] rounded mr-5 checkmark w-5 h-5">
            <CheckIcon width={20} height={20} />
          </span>
        </>
      )}
    </FormControlWrapper>
  );
});
