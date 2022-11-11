import clsx from 'clsx';
import type {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  HTMLInputTypeAttribute,
  PropsWithChildren,
} from 'react';
import { useFormClassNames } from './hooks';

export const FormControlWrapper: FC<
  PropsWithChildren<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
      title?: string;
      description?: string;
      error?: string;
      id: string;
      required?: boolean;
      type?: HTMLInputTypeAttribute;
    }
  >
> = ({ children, title, id, description, error, required, ...rest }) => {
  const classNames = useFormClassNames();
  const isCheckbox = rest.type === 'checkbox';
  const content = (
    <>
      {title && (
        <label className={classNames.label} htmlFor={id}>
          {title} {required && '*'}
        </label>
      )}
      {children}
      {error && <small className={classNames.error}>{error}</small>}
    </>
  );

  if (isCheckbox) {
    return (
      // @ts-ignore
      <label
        htmlFor={id}
        className={clsx(rest.className, 'cursor-pointer')}
        {...rest}
      >
        {content}
      </label>
    );
  }

  return <div {...rest}>{content}</div>;
};
