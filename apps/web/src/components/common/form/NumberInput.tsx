'use client';

import { Button } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cva, cx } from 'class-variance-authority';
import {
  MouseEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { Input, InputProps } from './Input';

const stepperButtonStyles = cva(
  'border border-gray-300 px-2 focus:border-project-primary focus:bg-project-secondary/10',
  {
    variants: {
      type: {
        plus: 'rounded-l-project-input border-r-0 ',
        minus: 'rounded-r-project-input border-l-0',
      },
    },
  },
);

const STEP_INTERVAL = 50;
const STEPPER_START_AFTER = 500;

export const NumberInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(function NumberInput(
  {
    prefix: prefixFromUpper,
    suffix: suffixFromUpper,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const onMouseDownCountDown = useRef<number | undefined>(undefined);
  const onMouseDownStepper = useRef<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onStepUpHandle = useCallback(() => {
    inputRef.current?.stepUp();
    inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, []);

  const onStepDownHandle = useCallback(() => {
    inputRef.current?.stepDown();
    inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, []);

  const onMouseDown = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      const direction = event.currentTarget.dataset.direction as
        | 'up'
        | 'down'
        | undefined;
      onMouseDownCountDown.current = setTimeout(() => {
        switch (direction) {
          case 'up':
            onMouseDownStepper.current = setInterval(
              () => onStepUpHandle(),
              STEP_INTERVAL,
            ) as unknown as number;
            break;
          case 'down':
            onMouseDownStepper.current = setInterval(
              () => onStepDownHandle(),
              STEP_INTERVAL,
            ) as unknown as number;
            break;
        }
      }, STEPPER_START_AFTER) as unknown as number;
    },
    [onStepUpHandle, onStepDownHandle],
  );

  const clearIntervals = useCallback(() => {
    clearInterval(onMouseDownStepper.current);
    clearInterval(onMouseDownCountDown.current);
  }, []);

  useEffect(() => {
    if (disabled) {
      clearIntervals();
    }
  }, [disabled, clearIntervals]);

  const prefix = (
    <>
      {prefixFromUpper}
      <Button
        onClick={onStepUpHandle}
        data-direction="up"
        className={stepperButtonStyles({ type: 'plus' })}
        onMouseUp={clearIntervals}
        onMouseLeave={clearIntervals}
        onMouseDown={onMouseDown}
        disabled={!!disabled}
      >
        <PlusIcon className="w-5 m-auto" />
      </Button>
    </>
  );

  const suffix = (
    <>
      {suffixFromUpper}
      <Button
        onClick={onStepDownHandle}
        data-direction="down"
        className={stepperButtonStyles({ type: 'minus' })}
        onMouseUp={clearIntervals}
        onMouseLeave={clearIntervals}
        onMouseDown={onMouseDown}
        disabled={!!disabled}
      >
        <MinusIcon className="w-5 m-auto" />
      </Button>
    </>
  );

  return (
    <Input
      prefix={prefix}
      suffix={suffix}
      type="number"
      className={cx('rounded-none text-center', className)}
      {...rest}
      readOnly
      disabled={disabled}
      ref={(element) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(element);
          } else {
            ref.current = element;
          }
        }

        inputRef.current = element;
      }}
    />
  );
});
