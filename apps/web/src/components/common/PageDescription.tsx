import { FC, PropsWithChildren } from 'react';

export const PageDescription: FC<PropsWithChildren> = ({ children }) => (
  <div className="text-xl max-w-5xl leading-relaxed font-medium text-project-text/80 mt-5">
    {children}
  </div>
);
