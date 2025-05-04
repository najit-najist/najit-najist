'use client';

import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { debounce } from 'es-toolkit';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

type FormData = { query?: string };

export const SearchForm: FC<{ initialData?: Partial<FormData> }> = ({
  initialData,
}) => {
  const formMethods = useForm<FormData>({
    defaultValues: initialData,
  });
  const { handleSubmit, register, watch } = formMethods;
  const [isLoading, activateIsLoading] = useTransition();
  const router = useRouter();
  const pathName = usePathname();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    ({ query }) => {
      let route = pathName;

      if (query) {
        const searchParams = new URLSearchParams({
          query,
        });

        route += `?${searchParams.toString()}`;
      }

      activateIsLoading(() => {
        // @ts-ignore
        router.replace(route);
      });
    },
    [pathName, router],
  );

  useEffect(() => {
    const debouncedSubmit = debounce(() => handleSubmit(onSubmit)(), 300);
    const subscription = watch(debouncedSubmit);

    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="Vyhledávání..."
        rootClassName="max-w-sm"
        size="normal"
        suffix={
          <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
            {formMethods.formState.isSubmitting || isLoading ? (
              <ArrowPathIcon className="w-6 h-6 mx-5 my-2 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />
            )}
          </div>
        }
        {...register('query')}
      />
    </form>
  );
};
