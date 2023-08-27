import { FC, PropsWithChildren } from 'react';

export const PageTitle: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="font-suez text-2xl md:text-6xl md:leading-relaxed max-w-[52rem]">
    {children}
  </h1>
);
