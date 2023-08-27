import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { cva, VariantProps } from 'class-variance-authority';
import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';

type AlertRootVariantProps = VariantProps<typeof alertRootStyles>;

export interface AlertProps
  extends Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      'color'
    >,
    AlertRootVariantProps {
  heading: ReactNode;
  icon?: typeof HandRaisedIcon;
}

const alertRootStyles = cva('rounded-md p-4', {
  variants: {
    color: {
      default: 'bg-blue-50',
      error: 'bg-red-50',
      warning: 'bg-yellow-50',
      success: 'bg-green-50',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

const iconStyles = cva('h-5 w-5', {
  variants: {
    color: {
      default: 'text-blue-400',
      error: 'text-red-400',
      warning: 'text-yellow-400',
      success: 'text-green-400',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

const titleStyles = cva('text-sm font-bold', {
  variants: {
    color: {
      default: 'text-blue-800',
      error: 'text-red-800',
      warning: 'text-yellow-800',
      success: 'text-green-800',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

const contentStyles = cva('mt-2 text-sm', {
  variants: {
    color: {
      default: 'text-blue-700',
      error: 'text-red-700',
      warning: 'text-yellow-700',
      success: 'text-green-700',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

export const Alert: FC<AlertProps> = ({
  heading,
  icon: IconComponent,
  className,
  color,
  children,
  ...rest
}) => {
  return (
    <div className={alertRootStyles({ className, color })} {...rest}>
      <div className="flex">
        {IconComponent ? (
          <div className="flex-shrink-0">
            <IconComponent
              className={iconStyles({ color })}
              aria-hidden="true"
            />
          </div>
        ) : null}
        <div className="ml-3">
          <h3 className={titleStyles({ color })}>{heading}</h3>
          {children ? (
            <div className={contentStyles({ color })}>{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
