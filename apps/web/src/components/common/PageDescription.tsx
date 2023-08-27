import { FC, PropsWithChildren } from 'react';

export const PageDescription: FC<PropsWithChildren> = ({ children }) => (
  <p className="text-3xl leading-6 max-w-7xl text-gray-500 font-medium">
    {children}
  </p>
);
