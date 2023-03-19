import { forwardRef, useId } from 'react';
import { Input as InputBase, InputProps } from '@najit-najist/ui';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id: idFromTop, ...rest },
  ref
) {
  const fallbackId = useId();
  const id = idFromTop ?? fallbackId;

  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {label}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        <InputBase {...rest} className="max-w-sm" id={id} ref={ref} />
      </div>
    </div>
  );
});
