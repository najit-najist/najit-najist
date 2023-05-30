import { cva, VariantProps } from 'class-variance-authority';
import { FC, PropsWithChildren } from 'react';

const badgeStyles = cva(
  'inline-flex gap-x-1.5 items-center rounded-md font-medium',
  {
    variants: {
      color: {
        gray: 'bg-gray-100 text-gray-600',
        red: 'bg-red-100 text-red-700',
        yellow: 'bg-yellow-100 text-yellow-800',
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
        indigo: 'bg-indigo-100 text-indigo-700',
        purple: 'bg-purple-100 text-purple-700',
        pink: 'bg-pink-100 text-pink-700',
      },
      size: {
        normal: 'px-2 py-1 text-xs',
        small: 'px-1.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-base',
      },
      withNotification: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      color: 'gray',
      size: 'normal',
      withNotification: false,
    },
  }
);

const notificationStyles = cva('rounded-full block', {
  variants: {
    size: {
      big: 'h-full w-full animate-ping bg-opacity-90 absolute',
      small: 'h-1.5 w-1.5 relative',
    },
    color: {
      gray: 'bg-sky-500',
      red: 'bg-sky-500',
      yellow: 'bg-sky-500',
      green: 'bg-sky-500',
      blue: 'bg-red-500',
      indigo: 'bg-sky-500',
      purple: 'bg-sky-500',
      pink: 'bg-sky-500',
    },
  },
});

export const Badge: FC<
  PropsWithChildren<VariantProps<typeof badgeStyles> & { className?: string }>
> = ({ children, color, size, withNotification, className }) => (
  <span className={badgeStyles({ color, size, withNotification, className })}>
    {withNotification ? (
      <div className="relative">
        <span className={notificationStyles({ size: 'big', color })} />
        <span className={notificationStyles({ size: 'small', color })} />
      </div>
    ) : null}
    {children}
  </span>
);
