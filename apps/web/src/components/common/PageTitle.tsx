import { FC, PropsWithChildren } from 'react';

export const PageTitle: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="font-title text-3xl md:text-6xl md:leading-5 tracking-wide max-w-[52rem]">
    {children}
  </h1>
);
