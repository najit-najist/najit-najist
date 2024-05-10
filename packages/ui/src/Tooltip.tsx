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
} from '@floating-ui/react';
import { Transition } from '@headlessui/react';
import { cx } from 'class-variance-authority';
import {
  FC,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  useRef,
  useState,
} from 'react';

export const Tooltip: FC<
  PropsWithChildren<{ trigger: ReactElement; disabled?: boolean }>
> = ({ trigger, children, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context, middlewareData, placement } =
    useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: 'top',
      // Make sure the tooltip stays on the screen
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(10),
        shift(),
        arrow({
          element: arrowRef,
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
          className="bg-white rounded-md shadow px-2 py-0.5 border border-project-secondary/50"
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
            className={cx(
              'w-2 h-2 bg-white rotate-45 absolute border-project-secondary',
              placement === 'top' ? 'border-b border-r' : 'border-t border-l'
            )}
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
