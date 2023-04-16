import { FC, PropsWithChildren } from 'react';

export const Section: FC<
  PropsWithChildren<{ title: string; description: string }>
> = ({ description, title, children }) => (
  <div className="space-y-6 sm:space-y-5">
    <div className="pt-10">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        {title}
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
    </div>
    {children}
  </div>
);
