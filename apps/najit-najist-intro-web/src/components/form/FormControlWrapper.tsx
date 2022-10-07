import type { FC, PropsWithChildren } from 'react';

export const FormControlWrapper: FC<
  PropsWithChildren<{
    title?: string;
    description?: string;
    error?: string;
  }>
> = ({ children, title }) => {
  return (
    <div>
      <span>{title}</span>
      {children}
    </div>
  );
};
