'use client';

import {
  FloatingPortal,
  useDismiss,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useFloating,
  shift,
  offset,
  autoUpdate,
  arrow,
  Placement,
} from '@floating-ui/react';
import { Transition } from '@headlessui/react';
import { cva, cx, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';
import {
  FC,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  useRef,
  useState,
} from 'react';

const tooltipClasses = cva('rounded-project shadow px-2 py-0.5 border', {
  variants: {
    color: {
      default: 'border-project-secondary/50 bg-white',
      warning: cx('border-yellow-400 bg-yellow-50'),
    },
    placement: {
      top: '',
      'top-start': '',
      'top-end': '',
      bottom: '',
      'bottom-start': '',
      'bottom-end': '',
    } satisfies Partial<Record<Placement, ClassValue>>,
  },
});
type SharedVariants = VariantProps<typeof tooltipClasses>;

const tooltipArrowClasses = cva('w-2 h-2 bg-white rotate-45 absolute', {
  variants: {
    color: {
      default: 'border-project-secondary',
      warning: 'border-yellow-400',
    },
    placement: {
      top: 'border-b border-r',
      'top-start': 'border-b border-r',
      'top-end': 'border-b border-r',
      bottom: 'border-t border-l',
      'bottom-start': 'border-t border-l',
      'bottom-end': 'border-t border-l',
    },
  } satisfies {
    [x in keyof SharedVariants]: Record<
      NonNullable<SharedVariants[x]>,
      ClassValue
    >;
  },
});

export const Tooltip: FC<
  PropsWithChildren<{
    trigger: ReactElement;
    disabled?: boolean;
    placement?: Placement;
    color?: SharedVariants['color'];
  }>
> = ({
  trigger,
  children,
  disabled,
  color = 'default',
  placement: userPlacement = 'top',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context, middlewareData, placement } =
    useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: userPlacement,
      // Make sure the tooltip stays on the screen
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(10),
        shift(),
        arrow({
          element: arrowRef,
          padding: 20,
        }),
      ],
    });

  // Event listeners to change the open state
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: 'tooltip' });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const triggerWithListeners = cloneElement(trigger, {
    ref: refs.setReference,
    ...getReferenceProps(),
  });

  return (
    <>
      {triggerWithListeners}
      <FloatingPortal>
        <Transition
          show={isOpen && !disabled}
          as="div"
          className={tooltipClasses({ placement: placement as any, color })}
          ref={refs.setFloating}
          style={floatingStyles}
          enter="transition-opacity duration-[400ms]"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          {...getFloatingProps()}
        >
          {children}
          <div
            ref={arrowRef}
            className={tooltipArrowClasses({
              placement: placement as any,
              color,
            })}
            style={{
              left: middlewareData.arrow?.x,
              top: middlewareData.arrow?.y,
            }}
          />
        </Transition>
      </FloatingPortal>
    </>
  );
};
