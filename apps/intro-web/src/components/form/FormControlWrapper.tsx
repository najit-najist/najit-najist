import type {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
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
    }
  >
> = ({ children, title, id, description, error, required, ...rest }) => {
  const classNames = useFormClassNames();

  return (
    <div {...rest}>
      {title && (
        <label className={classNames.label} htmlFor={id}>
          {title} {required && '*'}
        </label>
      )}
      {children}
      {description && <small className={classNames.error}>{error}</small>}
    </div>
  );
};
