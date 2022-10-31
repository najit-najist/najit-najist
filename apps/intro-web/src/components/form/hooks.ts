import clsx from 'clsx';

export const useFormClassNames = () => ({
  label: clsx('block text-sm mb-1.5'),
  input: clsx(
    'bg-[#e1e7e3] text-lg focus:outline-none p-2 pl-4 focus:bg-white focus:ring-1 focus:ring-[#87a893] rounded-md w-full'
  ),
  error: clsx('text-red-500'),
});
