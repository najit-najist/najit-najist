import clsx from 'clsx';
import { FC, PropsWithChildren, ReactNode } from 'react';

export const PostPageLayout: FC<
  PropsWithChildren<{ asideContent?: ReactNode }>
> = ({ asideContent, children }) => {
  return (
    <div className="grid grid-cols-8 w-full">
      <div className={clsx([!!asideContent ? 'col-span-6' : 'col-span-8'])}>
        {children}
      </div>
      {asideContent ? (
        <aside className="col-span-2 pl-10">{asideContent}</aside>
      ) : null}
    </div>
  );
};
