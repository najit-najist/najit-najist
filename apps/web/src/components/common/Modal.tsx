'use client';

import {
  Dialog,
  DialogPanel,
  DialogProps,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { cx } from 'class-variance-authority';
import { clsx } from 'clsx';
import { Fragment, ReactNode } from 'react';

export type ModalProps = Omit<DialogProps<'div'>, 'children'> & {
  title?: ReactNode;
  children: ReactNode;
  width?: 'normal' | 'sm' | 'lg';
  closeButtonText?: string;
};

const widthToClassName: Record<NonNullable<ModalProps['width']>, string> = {
  lg: 'sm:max-w-xl',
  normal: 'sm:max-w-lg',
  sm: 'sm:max-w-md',
};

export const Modal = ({
  open,
  className,
  onClose,
  children,
  title,
  closeButtonText = 'zavřít',
  width = 'normal',
  ...rest
}: ModalProps) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className={clsx('relative z-30', clsx)}
        onClose={onClose}
        {...rest}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={cx(
                  'relative transform overflow-hidden rounded-project bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full p-2 sm:p-3',
                  widthToClassName[width],
                )}
              >
                <div className="flex gap-5 pb-2 sm:pb-3 items-start">
                  {title ? (
                    <p className="text-sm leading-6 font-semibold text-gray-700">
                      {title}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    className="cursor-pointer rounded-project bg-red-400 font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 px-2 py-1 text-xs ml-auto"
                    onClick={() => onClose(false)}
                  >
                    {closeButtonText}
                  </button>
                </div>
                {title ? (
                  <hr className="mb-3 border-gray-200 border-t" />
                ) : null}
                <div>{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
