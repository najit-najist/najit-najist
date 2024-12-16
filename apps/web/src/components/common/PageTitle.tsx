import { FC, PropsWithChildren } from 'react';

export const PageTitle: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="font-title text-3xl md:text-5xl md:leading-[3.4rem] tracking-wide max-w-[52rem]">
    {children}
  </h1>
);
