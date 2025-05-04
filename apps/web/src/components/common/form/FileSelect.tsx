'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, useCallback, useId, useRef } from 'react';

import { FormControlWrapper } from './FormControlWrapper';

const rootStyles = cva('mt-2 text-sm text-red-600');

export interface FileSelectProps extends VariantProps<typeof rootStyles> {
  name: string;
  label?: string;
  error?: string;
  wrapperClassName?: string;
  value?: string[];
}

export const FileSelect = forwardRef<HTMLInputElement, FileSelectProps>(
  function FileSelect({ wrapperClassName, label, error, name }, ref) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const onDrop = useCallback(() => {
      // Do something with the files
    }, []);

    const onButtonClick = () => {
      if (inputRef == null) {
        return;
      }

      inputRef.current?.click();
    };

    return (
      <FormControlWrapper
        className={wrapperClassName}
        title={label}
        error={error}
        id={inputId}
      >
        <div className="mt-2 flex items-center gap-x-3">
          <div className="flex w-16 h-16 bg-white rounded-full border border-green-300">
            <PhotoIcon
              className="h-8 w-8 text-gray-300 m-auto"
              aria-hidden="true"
            />
          </div>
          <button
            type="button"
            className="rounded-project bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={onButtonClick}
          >
            Změnit
          </button>
        </div>
        <input
          name={name}
          className="hidden"
          type="file"
          ref={(value) => {
            if (!value) {
              return undefined;
            }

            if (ref !== null) {
              if (typeof ref === 'function') {
                ref(value);
              } else {
                ref.current = value;
              }
            }

            inputRef.current = value;
          }}
        />
      </FormControlWrapper>
    );
  },
);
