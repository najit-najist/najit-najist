import { FC } from 'react';

export const FormControlWrapper: FC<{
  title?: string;
  description?: string;
  error?: string;
}> = ({ children, title }) => {
  return (
    <div>
      <span>{title}</span>
      {children}
    </div>
  );
};
