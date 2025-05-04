import { cx } from 'class-variance-authority';
import React, { forwardRef, CSSProperties } from 'react';

export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties['cursor'];
}

export const Action = forwardRef<HTMLButtonElement, ActionProps>(
  ({ active, className, cursor, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cx(
          'flex w-5 h-5 p-0 items-center justify-center flex-[0_0_auto] touch-none cursor-[var(--cursor,pointer)] rounded-md border-0 outline-0 appearance-none bg-transparent hover:bg-gray-50 hover:[&_svg]:fill-gray-300',
          '[&_svg]:flex-[0_0_auto] [&_svg]:m-auto [&_svg]:h-full [&_svg]:overflow-visible [&_svg]:fill-gray-400',
          className,
        )}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            '--fill': active?.fill,
            '--background': active?.background,
          } as CSSProperties
        }
      />
    );
  },
);
