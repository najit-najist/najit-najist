import clsx from 'clsx';
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  HTMLInputTypeAttribute,
  PropsWithChildren,
  useId,
} from 'react';
import { FieldError } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';
import { Label } from './Label';

export interface FormControlWrapperBaseProps {
  title?: string;
  description?: string;
  error?: string | FieldError;
  id?: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
}

export interface FormControlWrapperProps
  extends Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      'id'
    >,
    FormControlWrapperBaseProps {}

export const FormControlWrapper: FC<
  PropsWithChildren<FormControlWrapperProps>
> = ({
  children,
  title,
  id: idOverride,
  description,
  error,
  required,
  ...rest
}) => {
  const fallbackId = useId();
  const id = idOverride ?? fallbackId;
  const isCheckbox = rest.type === 'checkbox';

  const content = (
    <>
      {title && (
        <Label htmlFor={id}>
          {title} {required && '*'}
        </Label>
      )}
      {children}
      {error && (
        <ErrorMessage>
          {typeof error === 'string' ? error : error?.message}
        </ErrorMessage>
      )}
    </>
  );

  if (isCheckbox) {
    return (
      // @ts-ignore
      <label
        htmlFor={id}
        className={clsx('cursor-pointer', rest.className)}
        {...rest}
      >
        {content}
      </label>
    );
  }

  return <div {...rest}>{content}</div>;
};
