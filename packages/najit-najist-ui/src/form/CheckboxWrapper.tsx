import { FC, PropsWithChildren } from 'react';

export const CheckboxWrapper: FC<
  PropsWithChildren<{
    title: string;
    description?: string;
    childId?: string;
    descriptionDescribesId?: string;
  }>
> = ({
  children,
  title,
  description,
  childId,
  descriptionDescribesId,
  ...rest
}) => {
  return (
    <div {...rest} className="relative flex items-start">
      <div className="flex h-6 items-center">{children}</div>
      <div className="ml-3 text-sm leading-6">
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
