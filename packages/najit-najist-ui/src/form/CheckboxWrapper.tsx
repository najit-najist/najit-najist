import { cx } from 'class-variance-authority';
import { FC, PropsWithChildren } from 'react';

export const CheckboxWrapper: FC<
  PropsWithChildren<{
    title: string;
    description?: string;
    childId?: string;
    descriptionDescribesId?: string;
    className?: string;
  }>
> = ({
  children,
  title,
  description,
  childId,
  descriptionDescribesId,
  className,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cx('relative flex items-start text-sm', className)}
    >
      <div className="flex h-6 items-center">{children}</div>
      <div className="ml-3 leading-6">
        <label htmlFor={childId} className="font-medium text-gray-900">
          {title}
        </label>
        {description ? (
          <p id={descriptionDescribesId} className="text-gray-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};
