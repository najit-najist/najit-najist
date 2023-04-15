import { FC, PropsWithChildren } from 'react';

export const Section: FC<PropsWithChildren> = ({ children }) => (
  <div className="w-full bg-white rounded-lg border-2 border-gray-100">
    <div className="py-5 w-full space-y-8 divide-y divide-gray-200 sm:space-y-5">
      {children}
    </div>
  </div>
);
