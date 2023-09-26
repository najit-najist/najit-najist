import { FC, PropsWithChildren } from 'react';

export const PageDescription: FC<PropsWithChildren> = ({ children }) => (
  <p className="text-2xl max-w-5xl leading-relaxed text-gray-500 font-medium">
    {children}
  </p>
);
