import { HandRaisedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cva, cx, VariantProps } from 'class-variance-authority';
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
  iconClassName?: string;
  onDismissClick?: () => void;
}

const alertRootStyles = cva('rounded-md p-3 border-solid', {
  variants: {
    color: {
      default: 'bg-blue-50',
      error: 'bg-red-50',
      warning: 'bg-yellow-50',
      success: 'bg-green-50',
    },
    outlined: {
      true: cx('border-2'),
      false: '',
    },
  },
  defaultVariants: {
    color: 'default',
    outlined: true,
  },
  compoundVariants: [
    {
      color: 'default',
      outlined: true,
      className: 'border-blue-300',
    },
    {
      color: 'error',
      outlined: true,
      className: 'border-red-300',
    },
    {
      color: 'warning',
      outlined: true,
      className: 'border-yellow-400 border-opacity-40',
    },
    {
      color: 'success',
      outlined: true,
      className: 'border-green-300 border-opacity-30',
    },
  ],
});

const iconStyles = cva('h-5 w-5 -mt-[1px]', {
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

const titleStyles = cva('text-sm font-bold mb-1.5', {
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

const contentStyles = cva('text-sm', {
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
  iconClassName,
  onDismissClick,
  outlined,
  ...rest
}) => {
  return (
    <div className={alertRootStyles({ className, color, outlined })} {...rest}>
      <div className="flex">
        <div className="w-full">
          <div className="flex justify-between items-start">
            <div>
              {IconComponent ? (
                <div className="flex-shrink-0 inline-block">
                  <IconComponent
                    className={iconStyles({
                      color,
                      className: cx(iconClassName, '-mb-1 mr-3'),
                    })}
                    aria-hidden="true"
                  />
                </div>
              ) : null}
              {heading ? (
                <h3 className={titleStyles({ color, class: 'inline-block' })}>
                  {heading}
                </h3>
              ) : null}
            </div>
            {onDismissClick ? (
              <button
                className="text-red-500 hover:rotate-90 duration-200 flex-none"
                onClick={onDismissClick}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            ) : null}
          </div>
          {children ? (
            <div className={contentStyles({ color })}>{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
