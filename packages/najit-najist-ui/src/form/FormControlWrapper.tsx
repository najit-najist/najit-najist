import clsx from 'clsx';
import type {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  HTMLInputTypeAttribute,
  PropsWithChildren,
} from 'react';
import { ErrorMessage } from './Input/ErrorMessage';
import { Label } from './Label';

export interface FormControlWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
  description?: string;
  error?: string;
  id: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
}

export const FormControlWrapper: FC<
  PropsWithChildren<FormControlWrapperProps>
> = ({ children, title, id, description, error, required, ...rest }) => {
  const isCheckbox = rest.type === 'checkbox';

  const content = (
    <>
      {title && (
        <Label htmlFor={id}>
          {title} {required && '*'}
        </Label>
      )}
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
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
